import { LLMProviderService } from "./provider.base";
import { StreamingSource } from "../interfaces/app.enum";
import { IClickableElement } from "../interfaces/app.interface";
import { EnvironmentConfig } from "../interfaces/environment.config";
export declare class OpenAIProvider extends LLMProviderService {
    private openai;
    environmentConfig: EnvironmentConfig;
    constructor();
    createInstances(config: {
        apiKey: string;
    }): void;
    setEnvironmentConfig(environmentConfig: EnvironmentConfig): void;
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
