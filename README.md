# @postcardbot/mcp-server

[![npm version](https://img.shields.io/npm/v/@postcardbot/mcp-server)](https://www.npmjs.com/package/@postcardbot/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<a href="https://glama.ai/mcp/servers/PostcardBot/postcardbot-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/PostcardBot/postcardbot-mcp-server/badge" alt="PostcardBot MCP server" />
</a>

**Send real postcards from code.** MCP server for [Postcard.bot](https://postcard.bot) — let AI agents send physical postcards worldwide.

Works with Claude Desktop, Claude Code, Cursor, Windsurf, and any MCP-compatible client.

## Hosted Server (Recommended)

The easiest way to get started — no API key needed, no local install. Just add the URL and sign in with your Postcard.bot account:

```
https://postcard.bot/api/mcp
```

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "postcardbot": {
      "url": "https://postcard.bot/api/mcp"
    }
  }
}
```

**Claude Code:**

```bash
claude mcp add --transport http postcardbot https://postcard.bot/api/mcp
```

Your MCP client will open a browser for you to sign in with Google or email. Click "Allow" and you're ready to send postcards.

---

## Local Server (npm)

If you prefer running the server locally with an API key:

### 1. Get an API key

Sign up at [postcard.bot](https://postcard.bot), go to your [account page](https://postcard.bot/account), and generate an API key.

### 2. Add balance

Add credits at [postcard.bot/buy-credits](https://postcard.bot/buy-credits) or via the API. Prepaid balance — volume pricing from $0.69/postcard.

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

Send a physical postcard. Cards are printed and shipped within 24 hours. Delivery takes 5-10 business days.

**Parameters:**
- `to` — Recipient address (`name`, `address_line1`, `city` required; `address_line2`, `state`, `zip`, `country` optional)
- `from` — Sender/return address (same fields)
- `message` — Back-of-card message (max 350 characters)
- `image_url` — Front image URL (publicly accessible, min 1875x1275px recommended)

**Example prompt:**
> "Send a postcard to Jane Doe at 123 Main St, San Francisco CA 94102 with a photo of the Golden Gate Bridge and the message 'Wish you were here!'"

### `bulk_send`

Send the same postcard to multiple recipients (async). Up to 5,000 recipients per request. Cards are processed in background batches.

**Parameters:**
- `recipients` — Array of recipient addresses (max 5,000, same fields as `to` above)
- `from` — Sender/return address (same for all postcards)
- `message` — Back-of-card message (max 350 characters)
- `image_url` — Front image URL (publicly accessible, min 1875x1275px recommended)

Returns a `bulk_id` immediately. Cards are processed in the background (~25/minute). Use `check_status` to poll progress.

Total cost is reserved upfront. Failed cards are automatically refunded.

### `check_balance`

Check account balance, lifetime top-up amount, and current volume pricing tier.

### `get_pricing`

Get all volume pricing tiers.

### `check_status`

Check delivery status of a previously sent postcard.

**Parameters:**
- `postcard_id` — The ID returned from `send_postcard`

### `list_webhooks`

List all registered webhooks for your account.

### `create_webhook`

Register a URL to receive postcard event notifications (sent, delivered, failed, returned). URL must use HTTPS. Max 10 webhooks per account.

**Parameters:**
- `url` — HTTPS URL to receive webhook POST requests
- `events` — Event types: `postcard.created`, `postcard.sent`, `postcard.delivered`, `postcard.failed`, `postcard.returned`

The signing secret is returned only once — save it securely. Events are signed with HMAC-SHA256 in the `X-PostcardBot-Signature` header.

### `delete_webhook`

Delete a registered webhook by its ID.

**Parameters:**
- `webhook_id` — The webhook ID (wh_...)

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
| Pay-as-you-go | $0 | $1.99 | $2.99 |
| Starter | $1-$19 | $1.49 | $2.49 |
| Bronze | $20-$49 | $1.29 | $2.29 |
| Silver | $50-$199 | $0.99 | $1.99 |
| Gold | $200-$499 | $0.85 | $1.85 |
| Platinum | $500-$999 | $0.79 | $1.79 |
| Diamond | $1,000+ | $0.69 | $1.69 |

## Links

- [Postcard.bot](https://postcard.bot)
- [Developer Docs](https://postcard.bot/developers)
- [OpenAPI Spec](https://postcard.bot/api/v1/openapi)
- [Buy Credits](https://postcard.bot/buy-credits)
- [npm Package](https://www.npmjs.com/package/@postcardbot/mcp-server)

## License

MIT
