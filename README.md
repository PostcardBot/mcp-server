# @postcardbot/mcp-server

[![npm version](https://img.shields.io/npm/v/@postcardbot/mcp-server)](https://www.npmjs.com/package/@postcardbot/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Send real postcards from code.** MCP server for [Postcard.bot](https://postcard.bot) — let AI agents send physical postcards worldwide.

Works with Claude Desktop, Claude Code, Cursor, Windsurf, and any MCP-compatible client.

<a href="https://glama.ai/mcp/servers/PostcardBot/postcardbot-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/PostcardBot/postcardbot-mcp-server/badge" alt="postcardbot-mcp-server MCP server" />
</a>

## Quick Start

### 1. Get an API key

Sign up at [postcard.bot](https://postcard.bot), go to your [account page](https://postcard.bot/account), and generate an API key.

### 2. Add balance

Add credits at [postcard.bot/buy-credits](https://postcard.bot/buy-credits) or via the API. Prepaid balance — volume pricing from $0.72/postcard.

### 3. Configure your MCP client

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "postcardbot": {
      "command": "npx",
      "args": ["-y", "@postcardbot/mcp-server"],
      "env": {
        "POSTCARDBOT_API_KEY": "pk_live_your_key_here"
      }
    }
  }
}
```

**Claude Code:**

```bash
claude mcp add postcardbot -- npx -y @postcardbot/mcp-server
```

Then set the environment variable `POSTCARDBOT_API_KEY` in your shell.

**Cursor / Windsurf** — add the same JSON config to your MCP settings.

## Tools

### `send_postcard`

Send a physical postcard. It will be printed and mailed within 24 hours.

**Parameters:**
- `to` — Recipient address (`name`, `address_line1`, `city` required; `address_line2`, `state`, `zip`, `country` optional)
- `from` — Sender/return address (same fields)
- `message` — Back-of-card message (max 350 characters)
- `image_url` — Front image URL (publicly accessible, min 1875x1275px recommended)

**Example prompt:**
> "Send a postcard to Jane Doe at 123 Main St, San Francisco CA 94102 with a photo of the Golden Gate Bridge and the message 'Wish you were here!'"

### `bulk_send`

Send the same postcard to multiple recipients at once. Same message, image, and return address for all cards.

**Parameters:**
- `recipients` — Array of recipient addresses (max 500, same fields as `to` above)
- `from` — Sender/return address (same for all postcards)
- `message` — Back-of-card message (max 350 characters)
- `image_url` — Front image URL (publicly accessible, min 1875x1275px recommended)

**Example prompt:**
> "Send a holiday postcard to my 3 friends: Jane at 123 Main St SF CA, John at 456 Oak Ave NYC NY, and Bob at 789 Pine Rd Austin TX"

Total cost is deducted upfront. Failed cards are automatically refunded.

### `check_balance`

Check account balance, lifetime top-up amount, and current volume pricing tier.

### `get_pricing`

Get all volume pricing tiers.

### `check_status`

Check delivery status of a previously sent postcard.

**Parameters:**
- `postcard_id` — The ID returned from `send_postcard`

## REST API

You can also use the HTTP API directly without MCP:

```bash
curl -X POST https://postcard.bot/api/v1/postcards \
  -H "Authorization: Bearer pk_live_your_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "to": {"name": "Jane Doe", "address_line1": "123 Main St", "city": "San Francisco", "state": "CA", "zip": "94102"},
    "from": {"name": "John Smith", "address_line1": "456 Oak Ave", "city": "New York", "state": "NY", "zip": "10001"},
    "message": "Wish you were here!",
    "image_url": "https://example.com/photo.jpg"
  }'
```

Full API docs and OpenAPI spec: [postcard.bot/developers](https://postcard.bot/developers)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `POSTCARDBOT_API_KEY` | Yes | Your API key from postcard.bot/account |
| `POSTCARDBOT_API_URL` | No | Override API base URL (default: https://postcard.bot) |

## Pricing

Volume pricing (based on lifetime top-up amount):

| Tier | Lifetime top-up | USA | International |
|------|-----------------|-----|---------------|
| Starter | $0-$49 | $1.99 | $2.99 |
| Bronze | $50-$99 | $1.49 | $2.49 |
| Silver | $100-$499 | $1.29 | $2.29 |
| Gold | $500-$999 | $0.99 | $2.15 |
| Platinum | $1,000-$4,999 | $0.85 | $2.05 |
| Diamond | $5,000+ | $0.72 | $1.99 |

## Links

- [Postcard.bot](https://postcard.bot)
- [Developer Docs](https://postcard.bot/developers)
- [OpenAPI Spec](https://postcard.bot/api/v1/openapi)
- [Buy Credits](https://postcard.bot/buy-credits)
- [npm Package](https://www.npmjs.com/package/@postcardbot/mcp-server)

## License

MIT