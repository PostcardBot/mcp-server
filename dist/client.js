"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostcardBotClient = void 0;
const DEFAULT_BASE_URL = 'https://postcard.bot';
class PostcardBotClient {
    apiKey;
    baseUrl;
    constructor(apiKey, baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl || DEFAULT_BASE_URL;
    }
    async request(method, path, body) {
        const url = `${this.baseUrl}/api/v1${path}`;
        const res = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'User-Agent': '@postcardbot/mcp-server/1.1.1',
            },
            ...(body ? { body: JSON.stringify(body) } : {}),
        });
        const data = await res.json();
        if (!res.ok) {
            const errorMsg = data.error || `API error: ${res.status}`;
            const details = data.details ? ` - ${data.details}` : '';
            const balanceInfo = data.balance !== undefined
                ? ` (balance: $${data.balance}, price: $${data.price})`
                : '';
            throw new Error(`${errorMsg}${details}${balanceInfo}`);
        }
        return data;
    }
    async sendPostcard(params) {
        return this.request('POST', '/postcards', params);
    }
    async bulkSend(params) {
        return this.request('POST', '/postcards/bulk', params);
    }
    async getPostcardStatus(id) {
        return this.request('GET', `/postcards/${encodeURIComponent(id)}`);
    }
    async getPricing() {
        return this.request('GET', '/pricing');
    }
    async getBalance() {
        return this.request('GET', '/balance');
    }
    async listWebhooks() {
        return this.request('GET', '/webhooks');
    }
    async createWebhook(params) {
        return this.request('POST', '/webhooks', params);
    }
    async deleteWebhook(id) {
        return this.request('DELETE', `/webhooks/${encodeURIComponent(id)}`);
    }
}
exports.PostcardBotClient = PostcardBotClient;
//# sourceMappingURL=client.js.map