const address = {
  type: 'object' as const,
  properties: {
    name: { type: 'string', maxLength: 40, description: 'Full name' },
    address_line1: { type: 'string', maxLength: 64, description: 'Street address' },
    address_line2: { type: 'string', maxLength: 64, description: 'Apartment, suite or unit (optional)' },
    city: { type: 'string', description: 'City' },
    state: { type: 'string', description: 'State/province; required for US addresses' },
    zip: { type: 'string', description: 'Postal code; a valid ZIP is required for US addresses' },
    country: { type: 'string', description: 'Two-letter country code, e.g. US, IE, GB. Defaults to US.' },
  },
  required: ['name', 'address_line1', 'city'],
}
const artwork = {
  message: { type: 'string', maxLength: 350, description: 'Message on the back of the postcard' },
  image_url: { type: 'string', description: 'Public HTTPS image URL; use preview_postcard to inspect resolution and cropping' },
  back_template: { type: 'string', enum: ['classic', 'heritage'], description: 'Optional postcard back layout' },
}
const postcardSchema = {
  type: 'object' as const,
  properties: {
    to: { ...address, description: 'Recipient address' },
    from: { ...address, description: 'Sender/return address' },
    ...artwork,
    image_fit_mode: { type: 'string', enum: ['cover', 'contain'], description: 'cover crops to fill; contain preserves the whole image with borders' },
  },
  required: ['to', 'from', 'message', 'image_url'],
}
const readOnly = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true }
const paidSend = { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true }

export const TOOLS = [
  {
    name: 'preview_postcard',
    description: 'Preview a postcard without sending physical mail or deducting balance. Returns the current account price, balance sufficiency, image/QR checks, back preview and warnings. A preview is not an order or a price reservation.',
    inputSchema: postcardSchema,
    annotations: readOnly,
  },
  {
    name: 'send_postcard',
    description: 'Place a paid physical-postcard order using prepaid balance. Use preview_postcard and check_balance first. A pending_review response means paid and queued, not yet submitted for printing; sent means accepted for printing, not delivered. Do not automatically repeat a timed-out send because it may already have been accepted.',
    inputSchema: postcardSchema,
    annotations: paidSend,
  },
  {
    name: 'check_balance',
    description: 'Read prepaid balance, lifetime top-up progress, current account-specific US/international rates and any pricing-protection expiry. Use these rates rather than calculating a price from public tiers.',
    inputSchema: { type: 'object' as const, properties: {} },
    annotations: readOnly,
  },
  {
    name: 'get_pricing',
    description: 'Read current public retail/prepaid pricing and announced subscription plans. Subscription availability may be early_access. Account-specific protected prices are returned by check_balance.',
    inputSchema: { type: 'object' as const, properties: {} },
    annotations: readOnly,
  },
  {
    name: 'bulk_send',
    description: 'Place a paid mailing to 1–5,000 recipients, using the same artwork and sender. {{name}} in the message expands to each recipient’s first name. Cost is reserved upfront; processing and review are asynchronous. Returns bulk_id. Check progress with check_status; processed does not mean delivered. Do not automatically retry a timed-out submission.',
    inputSchema: {
      type: 'object' as const,
      properties: { recipients: { type: 'array', minItems: 1, maxItems: 5000, items: address }, from: address, ...artwork },
      required: ['recipients', 'from', 'message', 'image_url'],
    },
    annotations: paidSend,
  },
  {
    name: 'check_status',
    description: 'Read a postcard’s status, delivery information, failure reason and refund, or a bulk job’s processing counts and failures. Pass either a postcard ID or bulk_id in postcard_id. Accepted/processed is not proof of delivery.',
    inputSchema: { type: 'object' as const, properties: { postcard_id: { type: 'string', minLength: 1, description: 'Postcard ID or bulk job ID (bulk_...)' } }, required: ['postcard_id'] },
    annotations: readOnly,
  },
  {
    name: 'list_webhooks',
    description: 'List registered webhooks for this account.',
    inputSchema: { type: 'object' as const, properties: {} },
    annotations: readOnly,
  },
  {
    name: 'create_webhook',
    description: 'Register an HTTPS webhook endpoint. The signing secret is returned only once; store it privately. The X-PostcardBot-Signature header signs timestamp.rawBody using HMAC-SHA256 and Base64; timestamps are Unix seconds. Payloads use an event/timestamp/data envelope.',
    inputSchema: {
      type: 'object' as const,
      properties: { url: { type: 'string', description: 'HTTPS callback URL' }, events: { type: 'array', minItems: 1, items: { type: 'string', enum: ['postcard.created', 'postcard.sent', 'postcard.delivered', 'postcard.failed', 'postcard.returned'] } } },
      required: ['url', 'events'],
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  },
  {
    name: 'delete_webhook',
    description: 'Delete a registered webhook by its wh_... ID.',
    inputSchema: { type: 'object' as const, properties: { webhook_id: { type: 'string', minLength: 1 } }, required: ['webhook_id'] },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: true },
  },
]
