const { test } = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const path = require('node:path')
const { Client } = require('@modelcontextprotocol/sdk/client/index.js')
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js')
const { version } = require('../package.json')

test('published MCP interface uses the current API without sending real mail', async (t) => {
  const requests = []
  let reply = {}
  let status = 200
  let raw = false
  const api = http.createServer(async (req, res) => {
    let body = ''
    for await (const chunk of req) body += chunk
    requests.push({ method: req.method, url: req.url, headers: req.headers, body: body ? JSON.parse(body) : undefined })
    res.writeHead(status, { 'Content-Type': raw ? 'text/html' : 'application/json' })
    res.end(raw ? String(reply) : JSON.stringify(reply))
  })
  await new Promise(resolve => api.listen(0, '127.0.0.1', resolve))
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [process.env.MCP_TEST_ENTRY || path.resolve(__dirname, '../dist/index.js')],
    env: { ...process.env, POSTCARDBOT_API_KEY: 'test-only-not-a-real-key', POSTCARDBOT_API_URL: `http://127.0.0.1:${api.address().port}/` },
    stderr: 'pipe',
  })
  const client = new Client({ name: 'protocol-test', version: '1.0.0' })
  t.after(async () => { await client.close(); api.closeAllConnections(); await new Promise(resolve => api.close(resolve)) })
  await client.connect(transport)
  const call = async (name, args = {}) => client.callTool({ name, arguments: args })
  const output = result => result.content.map(item => item.text || '').join('\n')
  const address = { name: 'Test User', address_line1: '123 Test St', city: 'Test', state: 'CA', zip: '94040', country: 'US' }
  const postcard = { to: address, from: address, message: 'Test only', image_url: 'https://example.com/test.jpg', back_template: 'classic', image_fit_mode: 'contain' }

  await t.test('handshake and tool annotations', async () => {
    assert.equal(client.getServerVersion().version, version)
    const { tools } = await client.listTools()
    assert.equal(tools.length, 9)
    assert.equal(tools.find(tool => tool.name === 'preview_postcard').annotations.readOnlyHint, true)
    assert.equal(tools.find(tool => tool.name === 'send_postcard').annotations.idempotentHint, false)
    assert.equal(tools.find(tool => tool.name === 'bulk_send').inputSchema.properties.recipients.maxItems, 5000)
  })
  await t.test('preview only uses preview endpoint and preserves warnings', async () => {
    reply = { mode: 'preview', will_send: false, can_send: false, price: 2.99, balance: { current: 0, sufficient: false }, warnings: ['Insufficient balance'] }
    const result = await call('preview_postcard', postcard)
    assert.match(output(result), /no balance deducted/)
    assert.match(output(result), /Insufficient balance/)
    assert.equal(JSON.parse(output(result).split('\n').slice(1).join('\n')).will_send, false)
    assert.equal(requests.length, 1)
    assert.equal(requests[0].url, '/api/v1/postcards/preview')
    assert.deepEqual(requests[0].body, postcard)
    assert.equal(requests[0].headers['user-agent'], `@postcardbot/mcp-server/${version}`)
    assert.equal(requests[0].headers.authorization, 'Bearer test-only-not-a-real-key')
  })
  await t.test('paid review hold is not described as sent', async () => {
    status = 202
    reply = { id: 'hold_test', status: 'pending_review', price: 1.99, balance_remaining: 3.01, message: 'Manual review required' }
    const result = await call('send_postcard', postcard)
    assert.equal(requests.at(-1).url, '/api/v1/postcards')
    assert.match(output(result), /not yet submitted for printing/)
    assert.match(output(result), /Manual review required/)
    assert.doesNotMatch(output(result), /sent successfully|delivered successfully/i)
    status = 200
  })
  await t.test('bulk IDs use the bulk status endpoint', async () => {
    reply = { bulk_id: 'bulk_test', status: 'processing', total: 3, processed: 2, succeeded: 1, failed: 1, total_cost: 5.97 }
    const result = await call('check_status', { postcard_id: 'bulk_test' })
    assert.equal(requests.at(-1).url, '/api/v1/postcards/bulk/bulk_test')
    assert.match(output(result), /"failed": 1/)
    assert.match(output(result), /not delivery confirmation/)
  })
  await t.test('failed postcard displays reason and refund', async () => {
    reply = { id: 'hold_failed', status: 'failed', error: 'Address rejected', refund: { amount: 1.99, kind: 'balance' }, queued_since: '2026-10-28T00:00:00Z', to: address }
    const result = await call('check_status', { postcard_id: 'hold_failed' })
    assert.match(output(result), /Address rejected/)
    assert.match(output(result), /Refund: \$1.99/)
    assert.match(output(result), /Queued since:/)
  })
  await t.test('balance displays actual rates and transition expiry', async () => {
    reply = { balance: 5, lifetime_top_up: 20, tier: { name: 'Protected', number: 1 }, current_pricing: { usa: 1.29, international: 2.29 }, pricing_protected_until: '2027-01-01T08:00:00.000Z', top_up_url: 'https://postcard.bot/buy-credits' }
    const result = await call('check_balance')
    assert.match(output(result), /USA: \$1.29/)
    assert.match(output(result), /2027-01-01T08:00:00.000Z/)
  })
  await t.test('bulk submit and webhook operations retain API compatibility', async () => {
    reply = { bulk_id: 'bulk_test', total: 1, total_cost: 1.99, status: 'queued', status_url: '/api/v1/postcards/bulk/bulk_test' }
    await call('bulk_send', { recipients: [address], from: address, message: 'Hi {{name}}', image_url: postcard.image_url })
    assert.equal(requests.at(-1).url, '/api/v1/postcards/bulk')
    reply = { webhooks: [] }
    assert.match(output(await call('list_webhooks')), /No webhooks/)
    reply = { id: 'wh_test', url: 'https://example.com/hook', events: ['postcard.sent'], secret: 'test-secret', active: true }
    await call('create_webhook', { url: reply.url, events: reply.events })
    assert.equal(requests.at(-1).method, 'POST')
    reply = { deleted: true }
    await call('delete_webhook', { webhook_id: 'wh_test' })
    assert.equal(requests.at(-1).url, '/api/v1/webhooks/wh_test')
    assert.equal(requests.at(-1).method, 'DELETE')
  })
  await t.test('API errors do not retry or report a successful send', async () => {
    const before = requests.length
    status = 503; raw = true; reply = '<html>Unavailable</html>'
    const result = await call('send_postcard', postcard)
    assert.equal(result.isError, true)
    assert.match(output(result), /HTTP 503/)
    assert.equal(requests.length, before + 1)
    status = 402; raw = false; reply = { error: 'Insufficient balance', balance: 0, price: 2.99 }
    assert.match(output(await call('send_postcard', postcard)), /Insufficient balance/)
    status = 200; reply = { postcards: { usa: { price: 2.99 } } }
    assert.deepEqual(JSON.parse(output(await call('get_pricing'))), reply)
    assert.equal((await call('unknown_tool')).isError, true)
  })
})
