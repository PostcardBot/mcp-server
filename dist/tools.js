"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOOLS = void 0;
const addressProperties = {
    name: { type: 'string', description: 'Full name' },
    address_line1: { type: 'string', description: 'Street address' },
    address_line2: { type: 'string', description: 'Apt, suite, unit, etc. (optional)' },
    city: { type: 'string', description: 'City' },
    state: { type: 'string', description: 'State or province (e.g. CA, ON, IDF)' },
    zip: { type: 'string', description: 'ZIP or postal code' },
    country: { type: 'string', description: 'Country code (e.g. US, FR, GB, DE). Defaults to US.' },
};
const addressRequired = ['name', 'address_line1', 'city'];
exports.TOOLS = [
    {
        name: 'send_postcard',
        description: 'Send a physical postcard that will be printed and shipped to a real address. Delivery takes 5-10 business days. ' +
            'Price depends on volume tier based on lifetime top-up (from $0.69–$1.99 USA, $1.99–$2.99 international). ' +
            'Charged from the user\'s prepaid Postcard.bot balance. ' +
            'Use check_balance to see current pricing tier before sending. ' +
            'Requires an image URL (publicly accessible) and a message (max 350 characters).',
        inputSchema: {
            type: 'object',
            properties: {
                to: {
                    type: 'object',
                    description: 'Recipient (mailing) address',
                    properties: addressProperties,
                    required: addressRequired,
                },
                from: {
                    type: 'object',
                    description: 'Sender (return) address',
                    properties: addressProperties,
                    required: addressRequired,
                },
                message: {
                    type: 'string',
                    description: 'Message text for the back of the postcard (max 350 characters)',
                },
                image_url: {
                    type: 'string',
                    description: 'URL of the image for the front of the postcard. Must be a publicly accessible HTTPS URL. ' +
                        'Recommended minimum resolution: 1875x1275 pixels.',
                },
            },
            required: ['to', 'from', 'message', 'image_url'],
        },
    },
    {
        name: 'check_balance',
        description: 'Check account balance, lifetime top-up amount, and current volume pricing tier. ' +
            'Use this before sending to know your per-postcard cost and available funds.',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'get_pricing',
        description: 'Get postcard pricing tiers based on lifetime top-up amount. ' +
            'USA from $1.99 (<$50) down to $0.69 ($5000+), ' +
            'International from $2.99 down to $1.99.',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'bulk_send',
        description: 'Send the same postcard to multiple recipients (async). Same message, image, and return address ' +
            'for all cards — only the recipient addresses differ. Up to 5,000 recipients per request. ' +
            'Total cost is reserved upfront; failed cards are automatically refunded. ' +
            'Returns a bulk_id immediately — cards are processed in background batches. ' +
            'Use check_status with the bulk_id to poll progress.',
        inputSchema: {
            type: 'object',
            properties: {
                recipients: {
                    type: 'array',
                    description: 'Array of recipient addresses (max 5,000)',
                    items: {
                        type: 'object',
                        properties: addressProperties,
                        required: addressRequired,
                    },
                },
                from: {
                    type: 'object',
                    description: 'Sender (return) address — same for all postcards',
                    properties: addressProperties,
                    required: addressRequired,
                },
                message: {
                    type: 'string',
                    description: 'Message text for the back of every postcard (max 350 characters)',
                },
                image_url: {
                    type: 'string',
                    description: 'URL of the image for the front of every postcard. Must be publicly accessible HTTPS URL. ' +
                        'Recommended minimum resolution: 1875x1275 pixels.',
                },
            },
            required: ['recipients', 'from', 'message', 'image_url'],
        },
    },
    {
        name: 'list_webhooks',
        description: 'List all registered webhooks for your account. ' +
            'Webhooks send real-time notifications to your URL when postcard events occur.',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'create_webhook',
        description: 'Register a webhook URL to receive postcard event notifications (sent, delivered, failed, returned). ' +
            'Events are signed with HMAC-SHA256. The signing secret is returned only once — save it securely. ' +
            'URL must use HTTPS. Maximum 10 webhooks per account.',
        inputSchema: {
            type: 'object',
            properties: {
                url: {
                    type: 'string',
                    description: 'HTTPS URL to receive webhook POST requests',
                },
                events: {
                    type: 'array',
                    description: 'Event types to subscribe to: postcard.created, postcard.sent, postcard.delivered, postcard.failed, postcard.returned',
                    items: { type: 'string' },
                },
            },
            required: ['url', 'events'],
        },
    },
    {
        name: 'delete_webhook',
        description: 'Delete a registered webhook by its ID.',
        inputSchema: {
            type: 'object',
            properties: {
                webhook_id: {
                    type: 'string',
                    description: 'The webhook ID (wh_...)',
                },
            },
            required: ['webhook_id'],
        },
    },
    {
        name: 'check_status',
        description: 'Check the delivery status of a previously sent postcard. ' +
            'Returns the current status, delivery tracking info, and expected delivery date.',
        inputSchema: {
            type: 'object',
            properties: {
                postcard_id: {
                    type: 'string',
                    description: 'The postcard ID returned from send_postcard',
                },
            },
            required: ['postcard_id'],
        },
    },
];
//# sourceMappingURL=tools.js.map