#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { PostcardBotClient } from './client.js'
import { TOOLS } from './tools.js'
import { VERSION } from './version.js'

const apiKey = process.env.POSTCARDBOT_API_KEY
if (!apiKey) {
  process.stderr.write(
    'Error: POSTCARDBOT_API_KEY environment variable is required.\n' +
    'Get your API key at https://postcard.bot/account\n'
  )
  process.exit(1)
}

const client = new PostcardBotClient(
  apiKey,
  process.env.POSTCARDBOT_API_URL || undefined
)

const server = new Server(
  { name: '@postcardbot/mcp-server', version: VERSION },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {
      case 'preview_postcard': {
        const result = await client.previewPostcard(args as unknown as Parameters<typeof client.previewPostcard>[0])
        return { content: [{ type: 'text', text: 'Preview only — no balance deducted and no postcard sent.\n' + JSON.stringify(result, null, 2) }] }
      }
      case 'send_postcard': {
        const result = await client.sendPostcard(args as unknown as Parameters<typeof client.sendPostcard>[0])
        return {
          content: [{
            type: 'text',
            text: [
              result.status === 'pending_review' ? 'Postcard paid for and queued for review; not yet submitted for printing.' : 'Postcard accepted for printing; this does not confirm delivery.',
              `Status: ${result.status}`,
              result.message || null,
              ``,
              `ID: ${result.id}`,
              `Expected delivery: ${result.expected_delivery_date || 'TBD'}`,
              `Price: $${result.price.toFixed(2)}`,
              result.pricing_tier ? `Pricing tier: ${result.pricing_tier.name} (${result.pricing_tier.source || 'current'})` : null,
              `Balance remaining: $${result.balance_remaining.toFixed(2)}`,
            ].filter(Boolean).join('\n'),
          }],
        }
      }

      case 'bulk_send': {
        const result = await client.bulkSend(args as unknown as Parameters<typeof client.bulkSend>[0])
        return {
          content: [{
            type: 'text',
            text: [
              `Bulk job queued!`,
              ``,
              `Bulk ID: ${result.bulk_id}`,
              `Total recipients: ${result.total}`,
              `Reserved cost: $${result.total_cost.toFixed(2)}`,
              result.pricing_tier ? `Pricing tier: ${result.pricing_tier.name} (${result.pricing_tier.source || 'current'})` : null,
              `Status: ${result.status}`,
              ``,
              `Processing is asynchronous; review holds can delay printing.`,
              `Poll status: ${result.status_url}`,
            ].filter(Boolean).join('\n'),
          }],
        }
      }

      case 'check_balance': {
        const result = await client.getBalance()
        return {
          content: [{
            type: 'text',
            text: [
              `Balance: $${result.balance.toFixed(2)}`,
              `Lifetime top-up: $${result.lifetime_top_up.toFixed(2)}`,
              `Pricing tier: ${result.tier.name} (Tier ${result.tier.number}${result.pricing_source ? `, ${result.pricing_source}` : ''})`,
              `  USA: $${result.current_pricing.usa.toFixed(2)}/postcard`,
              `  International: $${result.current_pricing.international.toFixed(2)}/postcard`,
              ...(result.pricing_protected_until ? [`Previous rates protected until: ${result.pricing_protected_until}`] : []),
              ``,
              `Top up at: ${result.top_up_url}`,
            ].join('\n'),
          }],
        }
      }

      case 'get_pricing': {
        const result = await client.getPricing()
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(result, null, 2),
          }],
        }
      }

      case 'list_webhooks': {
        const result = await client.listWebhooks()
        if (!result.webhooks.length) {
          return {
            content: [{ type: 'text', text: 'No webhooks registered. Use create_webhook to add one.' }],
          }
        }
        const lines = [`${result.webhooks.length} webhook(s):`, '']
        for (const wh of result.webhooks) {
          lines.push(`${wh.id} — ${wh.url}`)
          lines.push(`  Events: ${wh.events.join(', ')}`)
          lines.push(`  Active: ${wh.active}`)
          lines.push('')
        }
        return { content: [{ type: 'text', text: lines.join('\n') }] }
      }

      case 'create_webhook': {
        const typedArgs = args as { url: string; events: string[] }
        const result = await client.createWebhook({ url: typedArgs.url, events: typedArgs.events })
        return {
          content: [{
            type: 'text',
            text: [
              `Webhook created!`,
              ``,
              `ID: ${result.id}`,
              `URL: ${result.url}`,
              `Events: ${result.events.join(', ')}`,
              `Secret: ${result.secret}`,
              ``,
              `IMPORTANT: Save the secret above — it will not be shown again.`,
              `Use it to verify webhook signatures (HMAC-SHA256 in X-PostcardBot-Signature header).`,
            ].join('\n'),
          }],
        }
      }

      case 'delete_webhook': {
        const typedArgs = args as { webhook_id: string }
        await client.deleteWebhook(typedArgs.webhook_id)
        return {
          content: [{ type: 'text', text: `Webhook ${typedArgs.webhook_id} deleted.` }],
        }
      }

      case 'check_status': {
        const typedArgs = args as { postcard_id: string }
        if (typedArgs.postcard_id.startsWith('bulk_')) {
          const result = await client.getBulkStatus(typedArgs.postcard_id)
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) + '\nProcessed cards can still be awaiting review; this is not delivery confirmation.' }] }
        }
        const result = await client.getPostcardStatus(typedArgs.postcard_id)
        return {
          content: [{
            type: 'text',
            text: [
              `Postcard ${result.id}`,
              `Status: ${result.status}`,
              result.error ? `Reason: ${result.error}` : null,
              result.refund ? `Refund: $${result.refund.amount.toFixed(2)} (${result.refund.kind})` : null,
              result.queued_since ? `Queued since: ${result.queued_since}` : null,
              `Delivery: ${result.delivery_status_label || result.delivery_status || 'pending'}`,
              `Expected delivery: ${result.expected_delivery_date || 'TBD'}`,
              `To: ${result.to.name}, ${result.to.city}, ${result.to.country}`,
            ].filter(line => line !== null).join('\n'),
          }],
        }
      }

      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        }
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error: ${error instanceof Error ? error.message : String(error)}`,
      }],
      isError: true,
    }
  }
})

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((error) => {
  process.stderr.write(`Fatal error: ${error}\n`)
  process.exit(1)
})
