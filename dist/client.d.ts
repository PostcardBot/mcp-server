import type { SendPostcardParams, SendPostcardResponse, BulkSendParams, BulkSendResponse, PostcardStatusResponse, PricingResponse, BalanceResponse, CreateWebhookParams, WebhookResponse, WebhookListResponse } from './types.js';
export declare class PostcardBotClient {
    private apiKey;
    private baseUrl;
    constructor(apiKey: string, baseUrl?: string);
    private request;
    sendPostcard(params: SendPostcardParams): Promise<SendPostcardResponse>;
    bulkSend(params: BulkSendParams): Promise<BulkSendResponse>;
    getPostcardStatus(id: string): Promise<PostcardStatusResponse>;
    getPricing(): Promise<PricingResponse>;
    getBalance(): Promise<BalanceResponse>;
    listWebhooks(): Promise<WebhookListResponse>;
    createWebhook(params: CreateWebhookParams): Promise<WebhookResponse>;
    deleteWebhook(id: string): Promise<{
        deleted: boolean;
    }>;
}
