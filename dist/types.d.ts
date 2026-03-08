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
export interface BulkRecipientResult {
    index: number;
    id: string | null;
    status: 'sent' | 'failed';
    to?: string;
    error?: string;
    refunded?: number;
}
export interface BulkSendResponse {
    bulk_id: string;
    total: number;
    succeeded: number;
    failed: number;
    total_cost: number;
    balance_remaining: number;
    results: BulkRecipientResult[];
}
export interface ApiError {
    error: string;
    details?: string;
    balance?: number;
    price?: number;
    top_up_url?: string;
}
