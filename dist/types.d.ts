export interface Address {
    name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    zip?: string;
    country?: string;
}
export interface SendPostcardParams {
    to: Address;
    from: Address;
    message: string;
    image_url: string;
}
export interface SendPostcardResponse {
    id: string;
    status: string;
    service: 'lob' | 'kite';
    expected_delivery_date: string | null;
    price: number;
    balance_remaining: number;
}
export interface PostcardStatusResponse {
    id: string;
    status: string;
    delivery_status: string | null;
    service: string | null;
    expected_delivery_date: string | null;
    to: {
        name: string;
        city: string;
        state: string;
        country: string;
    };
    created_at: string | null;
    sent_at: number | null;
}
export interface PricingResponse {
    postcards: {
        usa: {
            price: number;
            currency: string;
        };
        international: {
            price: number;
            currency: string;
        };
    };
    packs: Array<{
        id: string;
        name: string;
        quantity: number;
        price: number;
        per_card: number;
        region: string;
    }>;
}
export interface BalanceResponse {
    balance: number;
    currency: string;
    lifetime_top_up: number;
    tier: {
        number: number;
        name: string;
    };
    current_pricing: {
        usa: number;
        international: number;
    };
    top_up_url: string;
}
export interface BulkSendParams {
    recipients: Address[];
    from: Address;
    message: string;
    image_url: string;
}
export interface BulkSendResponse {
    bulk_id: string;
    status: 'queued';
    total: number;
    total_cost: number;
    status_url: string;
    message: string;
}
export interface WebhookResponse {
    id: string;
    url: string;
    events: string[];
    secret?: string;
    active: boolean;
    created_at: string;
    updated_at?: string;
}
export interface WebhookListResponse {
    webhooks: WebhookResponse[];
}
export interface CreateWebhookParams {
    url: string;
    events: string[];
}
export interface ApiError {
    error: string;
    details?: string;
    balance?: number;
    price?: number;
    top_up_url?: string;
}
