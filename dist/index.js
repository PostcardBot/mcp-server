#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const client_js_1 = require("./client.js");
const tools_js_1 = require("./tools.js");
const apiKey = process.env.POSTCARDBOT_API_KEY;
if (!apiKey) {
    process.stderr.write('Error: POSTCARDBOT_API_KEY environment variable is required.\n' +
        'Get your API key at https://postcard.bot/account\n');
    process.exit(1);
}
const client = new client_js_1.PostcardBotClient(apiKey, process.env.POSTCARDBOT_API_URL || undefined);
const server = new index_js_1.Server({ name: '@postcardbot/mcp-server', version: '1.1.1' }, { capabilities: { tools: {} } });
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => ({
    tools: tools_js_1.TOOLS,
}));
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case 'send_postcard': {
                const result = await client.sendPostcard(args);
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
                };
            }
            case 'bulk_send': {
                const result = await client.bulkSend(args);
                return {
                    content: [{
                            type: 'text',
                            text: [
                                `Bulk job queued!`,
                                ``,
                                `Bulk ID: ${result.bulk_id}`,
                                `Total recipients: ${result.total}`,
                                `Reserved cost: $${result.total_cost.toFixed(2)}`,
                                `Status: ${result.status}`,
                                ``,
                                `Cards will be processed in background batches (~25/minute).`,
                                `Poll status: ${result.status_url}`,
                            ].join('\n'),
                        }],
                };
            }
            case 'check_balance': {
                const result = await client.getBalance();
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
                };
            }
            case 'get_pricing': {
                const result = await client.getPricing();
                return {
                    content: [{
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        }],
                };
            }
            case 'list_webhooks': {
                const result = await client.listWebhooks();
                if (!result.webhooks.length) {
                    return {
                        content: [{ type: 'text', text: 'No webhooks registered. Use create_webhook to add one.' }],
                    };
                }
                const lines = [`${result.webhooks.length} webhook(s):`, ''];
                for (const wh of result.webhooks) {
                    lines.push(`${wh.id} — ${wh.url}`);
                    lines.push(`  Events: ${wh.events.join(', ')}`);
                    lines.push(`  Active: ${wh.active}`);
                    lines.push('');
                }
                return { content: [{ type: 'text', text: lines.join('\n') }] };
            }
            case 'create_webhook': {
                const typedArgs = args;
                const result = await client.createWebhook({ url: typedArgs.url, events: typedArgs.events });
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
                };
            }
            case 'delete_webhook': {
                const typedArgs = args;
                await client.deleteWebhook(typedArgs.webhook_id);
                return {
                    content: [{ type: 'text', text: `Webhook ${typedArgs.webhook_id} deleted.` }],
                };
            }
            case 'check_status': {
                const typedArgs = args;
                const result = await client.getPostcardStatus(typedArgs.postcard_id);
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
                };
            }
            default:
                return {
                    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
                    isError: true,
                };
        }
    }
    catch (error) {
        return {
            content: [{
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                }],
            isError: true,
        };
    }
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    process.stderr.write(`Fatal error: ${error}\n`);
    process.exit(1);
});
//# sourceMappingURL=index.js.map