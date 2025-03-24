import { LLMProviderService } from "./provider.base";
import "dotenv/config";
import { StreamingSource } from "../interfaces/app.enum";
import { IClickableElement } from "../interfaces/app.interface";
export declare class AnthropicService extends LLMProviderService {
    private readonly apiKey;
    private readonly useBedrock;
    private readonly anthropic;
    private readonly bedrock;
    constructor();
    performTask(source: StreamingSource, history: any[], originalImage?: string, elements?: IClickableElement[], model?: string, retryCount?: number): Promise<Array<any>>;
    constructMessage(source: StreamingSource, history: any[], originalImage?: string, elements?: IClickableElement[]): Array<any>;
    bedrockProvider(messages: any, model: string): Promise<Array<any>>;
    anthropicProvider(messages: any[], model: string): Promise<Array<any>>;
    transform(toolResponse: Array<any>): ({
        type: string;
        text: any;
        toolName?: undefined;
        toolArgs?: undefined;
    } | {
        type: string;
        toolName: any;
        toolArgs: any;
        text?: undefined;
    } | undefined)[];
}
