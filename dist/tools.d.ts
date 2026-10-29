export declare const TOOLS: ({
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            image_fit_mode: {
                type: string;
                enum: string[];
                description: string;
            };
            message: {
                type: string;
                maxLength: number;
                description: string;
            };
            image_url: {
                type: string;
                description: string;
            };
            back_template: {
                type: string;
                enum: string[];
                description: string;
            };
            to: {
                description: string;
                type: "object";
                properties: {
                    name: {
                        type: string;
                        maxLength: number;
                        description: string;
                    };
                    address_line1: {
                        type: string;
                        maxLength: number;
                        description: string;
                    };
                    address_line2: {
                        type: string;
                        maxLength: number;
                        description: string;
                    };
                    city: {
                        type: string;
                        description: string;
                    };
                    state: {
                        type: string;
                        description: string;
                    };
                    zip: {
                        type: string;
                        description: string;
                    };
                    country: {
                        type: string;
                        description: string;
                    };
                };
                required: string[];
            };
            from: {
                description: string;
                type: "object";
                properties: {
                    name: {
                        type: string;
                        maxLength: number;
                        description: string;
                    };
                    address_line1: {
                        type: string;
                        maxLength: number;
                        description: string;
                    };
                    address_line2: {
                        type: string;
                        maxLength: number;
                        description: string;
                    };
                    city: {
                        type: string;
                        description: string;
                    };
                    state: {
                        type: string;
                        description: string;
                    };
                    zip: {
                        type: string;
                        description: string;
                    };
                    country: {
                        type: string;
                        description: string;
                    };
                };
                required: string[];
            };
        };
        required: string[];
    };
    annotations: {
        readOnlyHint: boolean;
        destructiveHint: boolean;
        idempotentHint: boolean;
        openWorldHint: boolean;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            postcard_id?: undefined;
            url?: undefined;
            events?: undefined;
            webhook_id?: undefined;
        };
        required?: undefined;
    };
    annotations: {
        readOnlyHint: boolean;
        destructiveHint: boolean;
        idempotentHint: boolean;
        openWorldHint: boolean;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            message: {
                type: string;
                maxLength: number;
                description: string;
            };
            image_url: {
                type: string;
                description: string;
            };
            back_template: {
                type: string;
                enum: string[];
                description: string;
            };
            recipients: {
                type: string;
                minItems: number;
                maxItems: number;
                items: {
                    type: "object";
                    properties: {
                        name: {
                            type: string;
                            maxLength: number;
                            description: string;
                        };
                        address_line1: {
                            type: string;
                            maxLength: number;
                            description: string;
                        };
                        address_line2: {
                            type: string;
                            maxLength: number;
                            description: string;
                        };
                        city: {
                            type: string;
                            description: string;
                        };
                        state: {
                            type: string;
                            description: string;
                        };
                        zip: {
                            type: string;
                            description: string;
                        };
                        country: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                };
            };
            from: {
                type: "object";
                properties: {
                    name: {
                        type: string;
                        maxLength: number;
                        description: string;
                    };
                    address_line1: {
                        type: string;
                        maxLength: number;
                        description: string;
                    };
                    address_line2: {
                        type: string;
                        maxLength: number;
                        description: string;
                    };
                    city: {
                        type: string;
                        description: string;
                    };
                    state: {
                        type: string;
                        description: string;
                    };
                    zip: {
                        type: string;
                        description: string;
                    };
                    country: {
                        type: string;
                        description: string;
                    };
                };
                required: string[];
            };
            postcard_id?: undefined;
            url?: undefined;
            events?: undefined;
            webhook_id?: undefined;
        };
        required: string[];
    };
    annotations: {
        readOnlyHint: boolean;
        destructiveHint: boolean;
        idempotentHint: boolean;
        openWorldHint: boolean;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            postcard_id: {
                type: string;
                minLength: number;
                description: string;
            };
            url?: undefined;
            events?: undefined;
            webhook_id?: undefined;
        };
        required: string[];
    };
    annotations: {
        readOnlyHint: boolean;
        destructiveHint: boolean;
        idempotentHint: boolean;
        openWorldHint: boolean;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            url: {
                type: string;
                description: string;
            };
            events: {
                type: string;
                minItems: number;
                items: {
                    type: string;
                    enum: string[];
                };
            };
            postcard_id?: undefined;
            webhook_id?: undefined;
        };
        required: string[];
    };
    annotations: {
        readOnlyHint: boolean;
        destructiveHint: boolean;
        idempotentHint: boolean;
        openWorldHint: boolean;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            webhook_id: {
                type: string;
                minLength: number;
            };
            postcard_id?: undefined;
            url?: undefined;
            events?: undefined;
        };
        required: string[];
    };
    annotations: {
        readOnlyHint: boolean;
        destructiveHint: boolean;
        idempotentHint: boolean;
        openWorldHint: boolean;
    };
})[];
