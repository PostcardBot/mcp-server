# @postcardbot/mcp-server

A local MCP server for [Postcard.bot](https://postcard.bot). Preview, send and track
physical postcards from an MCP-compatible client, using your Postcard.bot API key.

## Install and connect

Requires **Node.js 20+**. Get a key in your [account](https://postcard.bot/account).
You can preview before funding; sending requires [prepaid balance](https://postcard.bot/buy-credits).

For clients that use an `mcpServers` configuration:

```json
{
  "mcpServers": {
    "postcardbot": {
      "command": "npx",
      "args": ["-y", "@postcardbot/mcp-server@latest"],
      "env": {
        "POSTCARDBOT_API_KEY": "pk_live_your_key_here"
      }
    }
  }
}
```

Keep the real key private. Restart the MCP client after changing configuration or
updating the package. Pin `@postcardbot/mcp-server@1.3.0` for a reproducible version,
or use `@latest` to follow new releases. The server uses stdio; it is not an HTTP
server and does not open a local listening port.

| Environment variable | Required | Purpose |
| --- | --- | --- |
| `POSTCARDBOT_API_KEY` | Yes | API key from your account |
| `POSTCARDBOT_API_URL` | No | Server origin override; defaults to `https://postcard.bot` |

An origin override is not a sandbox switch. `send_postcard` and `bulk_send` create
paid physical-mail orders. The wrapper does not automatically retry requests:
a timed-out send may already have been accepted, so check before repeating it.

### Hosted alternative

For a client supporting remote Streamable HTTP and OAuth, use its remote-server
setup with:

```text
https://postcard.bot/api/mcp
```

Follow the client's sign-in flow. This hosted service is deployed separately;
its advertised tool list may differ from the local npm package documented below.
Do not put a remote URL into a client's local stdio configuration.

## Tools in 1.3.0

| Tool | Behavior |
| --- | --- |
| `preview_postcard` | Price, balance sufficiency, image/QR checks, back preview and warnings; **no mail or balance deduction** |
| `send_postcard` | Place one paid order; may return `pending_review` |
| `bulk_send` | Queue 1–5,000 recipients with shared artwork and sender |
| `check_balance` | Read actual account prices, balance, lifetime top-ups and any protection expiry |
| `get_pricing` | Read current public pricing and subscription availability |
| `check_status` | Read postcard or bulk-job status, including failure/refund information |
| `list_webhooks` | List the account's webhook endpoints |
| `create_webhook` | Register an HTTPS endpoint; returns its signing secret once |
| `delete_webhook` | Remove a webhook by ID |

Read-only tools are annotated as such. Paid sends are marked non-idempotent and
write-capable so clients can distinguish them from previews.

### Preview and single-card inputs

- `to` and `from`: `name`, `address_line1`, `city`; optional `address_line2`.
  Supply `state` and `zip` for US addresses. `country` defaults to US; use two-letter codes.
- `message`: up to 350 characters.
- `image_url`: a publicly accessible HTTPS image URL. Preview checks the image
  dimensions and fit for the destination.
- `image_fit_mode`: optional `cover` (crop to fill) or `contain` (preserve with borders).
- `back_template`: optional `classic` or `heritage`.

Start with a prompt such as:

> Preview a postcard using this photo, sender, recipient and message. Show me the
> price and any warnings, but do not send it yet.

A preview does not reserve a price or balance. Call `check_balance` for current
account rates and explicitly request a send when ready.

### Bulk and delivery status

`bulk_send` accepts `recipients`, `from`, `message`, `image_url`, and optional
`back_template`. `{{name}}` expands to the recipient's first name. Cost is reserved
upfront and processing is asynchronous; review holds can delay printing.

Pass either the postcard ID or `bulk_id` in `check_status.postcard_id`:

```json
{"postcard_id": "bulk_example"}
```

- **`pending_review`**: paid and queued; not yet submitted for printing.
- **`sent`**: accepted for printing; not proof of delivery.
- **`failed` / `cancelled`**: check the returned reason and refund information.
- A bulk job's **`processed`** count may include cards still under review.

Delivery estimates are not guarantees. Fulfilment routing is internal; no supplier
field is required or displayed by the package.

### Webhooks

`create_webhook` takes `url` and an `events` array. Supported event names are
`postcard.created`, `postcard.sent`, `postcard.delivered`, `postcard.failed`, and
`postcard.returned`. Save the returned secret securely.

Verify the raw body against `X-PostcardBot-Signature`:
` t=UNIX_SECONDS,v1=BASE64_HMAC_SHA256 `, signing `timestamp.rawBody` with the issued
secret. Preserve Base64 padding. Payloads have an `event`, `timestamp`, and `data`
envelope; postcard fields are inside `data`. Bulk summaries use `data.is_bulk` and
`data.bulk_id`. Make receiver-side business actions idempotent.

[Node, Python and cURL examples](https://github.com/PostcardBot/postcard-examples)
include tested webhook receivers.

## Pricing

USD per postcard, including printing and postage. Snapshot: **October 28, 2026**.
Use `get_pricing` for live public rates and `check_balance` for account-specific rates.

| Option | Lifetime paid top-ups | US | International |
| --- | ---: | ---: | ---: |
| Pay as you go | None | $2.99 | $2.99 |
| Prepaid | $5+ | $1.99 | $2.79 |
| Prepaid | $50+ | $1.69 | $2.69 |
| Prepaid | $500+ | $1.49 | $2.49 |

Minimum top-up is $5. These are cumulative funding thresholds, not card counts.
Balance and lifetime progress do not expire; per-card rates may change. Eligible
existing funded accounts keep previous rates through **December 31, 2026 Pacific**.
`check_balance` reports the actual rate and `pricing_protected_until` where applicable.

### White-label early access

[White-label plans](https://postcard.bot/business/white-label) are announced, with
free early-access requests. Paid subscriptions are not open yet. Standard MCP
sending does not automatically enable custom white-label designs.

| Planned plan | Subscription | US/card | International/card |
| --- | --- | ---: | ---: |
| Business | $99/month | $0.99 | $2.19 |
| Pro monthly | $199/month | $0.89 | $2.09 |
| Pro yearly | $1,999/year | $0.89 | $2.09 |

Cards are charged separately from subscription fees.

## Development

```bash
npm ci
npm test
npm pack
```

Tests use a local mock API and real MCP stdio transport; no real key, payment or
physical mail is needed. `prepack` rebuilds the distributable so the npm artifact
matches the TypeScript source. Version information is read from `package.json`.

## Links

- [Developer docs](https://postcard.bot/developers)
- [OpenAPI](https://postcard.bot/api/v1/openapi)
- [API examples](https://github.com/PostcardBot/postcard-examples)
- [US artwork guide](https://postcard.bot/api/v1/designs/guides/us)
- [International artwork guide](https://postcard.bot/api/v1/designs/guides/international)
- [Source and issues](https://github.com/PostcardBot/mcp-server)
- [Mailing terms](https://postcard.bot/terms)

## License

MIT
