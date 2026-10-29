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
    image_fit_mode?: 'cover' | 'contain';
    back_template?: 'classic' | 'heritage';
}
export interface SendPostcardResponse {
    id: string;
    status: string;
    message?: string;
    expected_delivery_date: string | null;
    price: number;
    pricing_tier?: PricingTierSummary;
    back_template?: 'classic' | 'heritage';
    balance_remaining: number;
}
export interface PricingTierSummary {
    number: number;
    name: string;
    source?: 'pay_as_you_go' | 'top_up' | 'api_subscription';
    usa?: number;
    international?: number;
}
export interface PostcardStatusResponse {
    id: string;
    status: string;
    error?: string | null;
    refund?: {
        amount: number;
        kind: string;
    } | null;
    queued_since?: string | null;
    delivery_status: string | null;
    delivery_status_label?: string | null;
    expected_delivery_date: string | null;
    mail_events?: Array<{
        status: string;
        label: string;
        occurred_at: string | null;
    }>;
    to: {
        name: string;
        city: string;
        state: string;
        country: string;
    };
    created_at: string | number | null;
    sent_at: string | number | null;
}
export interface PricingResponse {
    postcards: {
        usa: {
            price: number;
            currency: string;
            note?: string;
        };
        international: {
            price: number;
            currency: string;
            note?: string;
        };
    };
    minimum_top_up: number;
    pricing_notice: string;
    tier_notice: string;
    volume_tiers: Array<{
        tier: number;
        name: string;
        min_top_up: number;
        max_top_up: number | null;
        usa_price: number;
        international_price: number;
    }>;
    api_subscription_plans?: Array<{
        id: string;
        name: string;
        price_monthly: number;
        price_per_billing_period?: number;
        annual_total?: number | null;
        usa_price?: number;
        international_price?: number;
        availability?: string;
        request_access_url?: string;
        billing: 'monthly' | 'annual';
        grants_tier: string;
        note?: string;
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
    balance_tier?: PricingTierSummary;
    subscription_tier?: PricingTierSummary | null;
    pricing_source?: 'pay_as_you_go' | 'top_up' | 'api_subscription';
    pricing_protected_until?: string | null;
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
    back_template?: 'classic' | 'heritage';
}
export interface PreviewPostcardResponse {
    mode: 'preview';
    will_send: false;
    can_send: boolean;
    price: number;
    balance: {
        current: number;
        sufficient: boolean;
    };
    warnings: string[];
    [key: string]: unknown;
}
export interface BulkStatusResponse {
    bulk_id: string;
    status: string;
    total: number;
    processed: number;
    succeeded: number;
    failed: number;
    total_cost: number;
    failures?: Array<{
        index: number;
        to: string;
        error: string;
    }>;
    postcard_ids?: string[];
    postcard_ids_truncated?: boolean;
    [key: string]: unknown;
}
export interface BulkSendResponse {
    bulk_id: string;
    status: 'queued';
    total: number;
    total_cost: number;
    pricing_tier?: PricingTierSummary;
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
