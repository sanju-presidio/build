import { LLMProviderService } from "./provider.base";
import { StreamingSource } from "../interfaces/app.enum";
import { IClickableElement } from "../interfaces/app.interface";
export declare class OpenAIProvider extends LLMProviderService {
    private readonly apiKey;
    private readonly openai;
    constructor();
    performTask(source: StreamingSource, history: any[], originalImage?: string, elements?: IClickableElement[], model?: string, retryCount?: number): Promise<Array<any>>;
    constructMessage(source: StreamingSource, history: any[], originalImage?: string, elements?: IClickableElement[]): any[];
    openaiProvider(messages: any[], model: string): Promise<any[]>;
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
