export declare const TOOLS: ({
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            to: {
                type: "object";
                description: string;
                properties: {
                    name: {
                        type: "string";
                        description: string;
                    };
                    address_line1: {
                        type: "string";
                        description: string;
                    };
                    address_line2: {
                        type: "string";
                        description: string;
                    };
                    city: {
                        type: "string";
                        description: string;
                    };
                    state: {
                        type: "string";
                        description: string;
                    };
                    zip: {
                        type: "string";
                        description: string;
                    };
                    country: {
                        type: "string";
                        description: string;
                    };
                };
                required: string[];
            };
            from: {
                type: "object";
                description: string;
                properties: {
                    name: {
                        type: "string";
                        description: string;
                    };
                    address_line1: {
                        type: "string";
                        description: string;
                    };
                    address_line2: {
                        type: "string";
                        description: string;
                    };
                    city: {
                        type: "string";
                        description: string;
                    };
                    state: {
                        type: "string";
                        description: string;
                    };
                    zip: {
                        type: "string";
                        description: string;
                    };
                    country: {
                        type: "string";
                        description: string;
                    };
                };
                required: string[];
            };
            message: {
                type: "string";
                description: string;
            };
            image_url: {
                type: "string";
                description: string;
            };
            recipients?: undefined;
            url?: undefined;
            events?: undefined;
            webhook_id?: undefined;
            postcard_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            to?: undefined;
            from?: undefined;
            message?: undefined;
            image_url?: undefined;
            recipients?: undefined;
            url?: undefined;
            events?: undefined;
            webhook_id?: undefined;
            postcard_id?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            recipients: {
                type: "array";
                description: string;
                items: {
                    type: "object";
                    properties: {
                        name: {
                            type: "string";
                            description: string;
                        };
                        address_line1: {
                            type: "string";
                            description: string;
                        };
                        address_line2: {
                            type: "string";
                            description: string;
                        };
                        city: {
                            type: "string";
                            description: string;
                        };
                        state: {
                            type: "string";
                            description: string;
                        };
                        zip: {
                            type: "string";
                            description: string;
                        };
                        country: {
                            type: "string";
                            description: string;
                        };
                    };
                    required: string[];
                };
            };
            from: {
                type: "object";
                description: string;
                properties: {
                    name: {
                        type: "string";
                        description: string;
                    };
                    address_line1: {
                        type: "string";
                        description: string;
                    };
                    address_line2: {
                        type: "string";
                        description: string;
                    };
                    city: {
                        type: "string";
                        description: string;
                    };
                    state: {
                        type: "string";
                        description: string;
                    };
                    zip: {
                        type: "string";
                        description: string;
                    };
                    country: {
                        type: "string";
                        description: string;
                    };
                };
                required: string[];
            };
            message: {
                type: "string";
                description: string;
            };
            image_url: {
                type: "string";
                description: string;
            };
            to?: undefined;
            url?: undefined;
            events?: undefined;
            webhook_id?: undefined;
            postcard_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            url: {
                type: "string";
                description: string;
            };
            events: {
                type: "array";
                description: string;
                items: {
                    type: "string";
                };
            };
            to?: undefined;
            from?: undefined;
            message?: undefined;
            image_url?: undefined;
            recipients?: undefined;
            webhook_id?: undefined;
            postcard_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            webhook_id: {
                type: "string";
                description: string;
            };
            to?: undefined;
            from?: undefined;
            message?: undefined;
            image_url?: undefined;
            recipients?: undefined;
            url?: undefined;
            events?: undefined;
            postcard_id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            postcard_id: {
                type: "string";
                description: string;
            };
            to?: undefined;
            from?: undefined;
            message?: undefined;
            image_url?: undefined;
            recipients?: undefined;
            url?: undefined;
            events?: undefined;
            webhook_id?: undefined;
        };
        required: string[];
    };
})[];
