export declare abstract class BaseTool {
    abstract name: string;
    abstract description: string;
    abstract inputSchema: Object;
    getToolSchema: () => {
        name: string;
        description: string;
        input_schema: Object;
    };
    getOpenAISchema: () => {
        type: string;
        function: {
            name: string;
            description: string;
            parameters: {
                additionalProperties: boolean;
                constructor: Function;
                toString(): string;
                toLocaleString(): string;
                valueOf(): Object;
                hasOwnProperty(v: PropertyKey): boolean;
                isPrototypeOf(v: Object): boolean;
                propertyIsEnumerable(v: PropertyKey): boolean;
            };
            strict: boolean;
        };
    };
}
export declare class LaunchAction extends BaseTool {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            url: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
}
export declare class ClickAction extends BaseTool {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            coordinate: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
}
export declare class TypeAction extends BaseTool {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            text: {
                type: string;
                description: string;
            };
            coordinate: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
}
export declare class KeyPressAction extends BaseTool {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            key: {
                type: string;
                description: string;
            };
            coordinate: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
}
export declare class ScrollAction extends BaseTool {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            direction: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
}
export declare class CompleteTaskAction extends BaseTool {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            result: {
                type: string;
                description: string;
            };
            status: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
}
