import type {
  SendPostcardParams,
  SendPostcardResponse,
  BulkSendParams,
  BulkSendResponse,
  PostcardStatusResponse,
  PricingResponse,
  BalanceResponse,
  CreateWebhookParams,
  WebhookResponse,
  WebhookListResponse,
} from './types.js'

const DEFAULT_BASE_URL = 'https://postcard.bot'

export class PostcardBotClient {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl || DEFAULT_BASE_URL
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}/api/v1${path}`
    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': '@postcardbot/mcp-server/1.1.1',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })

    const data = await res.json()

    if (!res.ok) {
      const errorMsg = data.error || `API error: ${res.status}`
      const details = data.details ? ` - ${data.details}` : ''
      const balanceInfo = data.balance !== undefined
        ? ` (balance: $${data.balance}, price: $${data.price})`
        : ''
      throw new Error(`${errorMsg}${details}${balanceInfo}`)
    }

    return data as T
  }

  async sendPostcard(params: SendPostcardParams): Promise<SendPostcardResponse> {
    return this.request<SendPostcardResponse>('POST', '/postcards', params)
  }

  async bulkSend(params: BulkSendParams): Promise<BulkSendResponse> {
    return this.request<BulkSendResponse>('POST', '/postcards/bulk', params)
  }

  async getPostcardStatus(id: string): Promise<PostcardStatusResponse> {
    return this.request<PostcardStatusResponse>('GET', `/postcards/${encodeURIComponent(id)}`)
  }

  async getPricing(): Promise<PricingResponse> {
    return this.request<PricingResponse>('GET', '/pricing')
  }

  async getBalance(): Promise<BalanceResponse> {
    return this.request<BalanceResponse>('GET', '/balance')
  }

  async listWebhooks(): Promise<WebhookListResponse> {
    return this.request<WebhookListResponse>('GET', '/webhooks')
  }

  async createWebhook(params: CreateWebhookParams): Promise<WebhookResponse> {
    return this.request<WebhookResponse>('POST', '/webhooks', params)
  }

  async deleteWebhook(id: string): Promise<{ deleted: boolean }> {
    return this.request<{ deleted: boolean }>('DELETE', `/webhooks/${encodeURIComponent(id)}`)
  }
}
