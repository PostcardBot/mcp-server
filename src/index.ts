#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { PostcardBotClient } from './client.js'
import { TOOLS } from './tools.js'

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
  { name: '@postcardbot/mcp-server', version: '1.1.0' },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {
      case 'send_postcard': {
        const result = await client.sendPostcard(args as unknown as Parameters<typeof client.sendPostcard>[0])
        return {
          content: [{
            type: 'text',
            text: [
              `Postcard sent successfully!`,
              ``,
              `ID: ${result.id}`,
              `Service: ${result.service}`,
              `Expected delivery: ${result.expected_delivery_date || 'TBD'}`,
              `Price: $${result.price.toFixed(2)}`,
              `Balance remaining: $${result.balance_remaining.toFixed(2)}`,
            ].join('\n'),
          }],
        }
      }

      case 'bulk_send': {
        const result = await client.bulkSend(args as unknown as Parameters<typeof client.bulkSend>[0])
        const lines = [
          `Bulk send complete!`,
          ``,
          `Bulk ID: ${result.bulk_id}`,
          `Total: ${result.total} | Sent: ${result.succeeded} | Failed: ${result.failed}`,
          `Total cost: $${result.total_cost.toFixed(2)}`,
          `Balance remaining: $${result.balance_remaining.toFixed(2)}`,
        ]
        if (result.failed > 0) {
          lines.push(``, `Failed postcards:`)
          for (const r of result.results.filter(r => r.status === 'failed')) {
            lines.push(`  #${r.index}: ${r.error} (refunded $${r.refunded?.toFixed(2)})`)
          }
        }
        return {
          content: [{
            type: 'text',
            text: lines.join('\n'),
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
              `Pricing tier: ${result.tier.name} (Tier ${result.tier.number})`,
              `  USA: $${result.current_pricing.usa.toFixed(2)}/postcard`,
              `  International: $${result.current_pricing.international.toFixed(2)}/postcard`,
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

      case 'check_status': {
        const typedArgs = args as { postcard_id: string }
        const result = await client.getPostcardStatus(typedArgs.postcard_id)
        return {
          content: [{
            type: 'text',
            text: [
              `Postcard ${result.id}`,
              `Status: ${result.status}`,
              `Delivery: ${result.delivery_status || 'pending'}`,
              `Service: ${result.service || 'unknown'}`,
              `Expected delivery: ${result.expected_delivery_date || 'TBD'}`,
              `To: ${result.to.name}, ${result.to.city}, ${result.to.country}`,
            ].join('\n'),
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
