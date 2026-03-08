const addressProperties = {
  name: { type: 'string' as const, description: 'Full name' },
  address_line1: { type: 'string' as const, description: 'Street address' },
  address_line2: { type: 'string' as const, description: 'Apt, suite, unit, etc. (optional)' },
  city: { type: 'string' as const, description: 'City' },
  state: { type: 'string' as const, description: 'State or province (e.g. CA, ON, IDF)' },
  zip: { type: 'string' as const, description: 'ZIP or postal code' },
  country: { type: 'string' as const, description: 'Country code (e.g. US, FR, GB, DE). Defaults to US.' },
}

const addressRequired = ['name', 'address_line1', 'city']

export const TOOLS = [
  {
    name: 'send_postcard',
    description:
      'Send a physical postcard that will be printed and shipped to a real address. Delivery takes 5-10 business days. ' +
      'Price depends on volume tier based on lifetime top-up (from $0.72–$1.99 USA, $1.99–$2.99 international). ' +
      'Charged from the user\'s prepaid Postcard.bot balance. ' +
      'Use check_balance to see current pricing tier before sending. ' +
      'Requires an image URL (publicly accessible) and a message (max 350 characters).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        to: {
          type: 'object' as const,
          description: 'Recipient (mailing) address',
          properties: addressProperties,
          required: addressRequired,
        },
        from: {
          type: 'object' as const,
          description: 'Sender (return) address',
          properties: addressProperties,
          required: addressRequired,
        },
        message: {
          type: 'string' as const,
          description: 'Message text for the back of the postcard (max 350 characters)',
        },
        image_url: {
          type: 'string' as const,
          description:
            'URL of the image for the front of the postcard. Must be a publicly accessible HTTPS URL. ' +
            'Recommended minimum resolution: 1875x1275 pixels.',
        },
      },
      required: ['to', 'from', 'message', 'image_url'],
    },
  },
  {
    name: 'check_balance',
    description:
      'Check account balance, lifetime top-up amount, and current volume pricing tier. ' +
      'Use this before sending to know your per-postcard cost and available funds.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'get_pricing',
    description:
      'Get postcard pricing tiers based on lifetime top-up amount. ' +
      'USA from $1.99 (<$50) down to $0.72 ($5000+), ' +
      'International from $2.99 down to $1.99.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'bulk_send',
    description:
      'Send the same postcard to multiple recipients at once. Same message, image, and return address ' +
      'for all cards — only the recipient addresses differ. Maximum 500 recipients per request. ' +
      'Total cost is deducted upfront from balance; failed cards are automatically refunded. ' +
      'Volume pricing applies based on your tier.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        recipients: {
          type: 'array' as const,
          description: 'Array of recipient addresses (max 500)',
          items: {
            type: 'object' as const,
            properties: addressProperties,
            required: addressRequired,
          },
        },
        from: {
          type: 'object' as const,
          description: 'Sender (return) address — same for all postcards',
          properties: addressProperties,
          required: addressRequired,
        },
        message: {
          type: 'string' as const,
          description: 'Message text for the back of every postcard (max 350 characters)',
        },
        image_url: {
          type: 'string' as const,
          description:
            'URL of the image for the front of every postcard. Must be publicly accessible HTTPS URL. ' +
            'Recommended minimum resolution: 1875x1275 pixels.',
        },
      },
      required: ['recipients', 'from', 'message', 'image_url'],
    },
  },
  {
    name: 'check_status',
    description:
      'Check the delivery status of a previously sent postcard. ' +
      'Returns the current status, delivery tracking info, and expected delivery date.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        postcard_id: {
          type: 'string' as const,
          description: 'The postcard ID returned from send_postcard',
        },
      },
      required: ['postcard_id'],
    },
  },
]
