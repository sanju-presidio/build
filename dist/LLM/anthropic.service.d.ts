import Anthropic from "@anthropic-ai/sdk";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { LLMProviderService } from "./provider.base";
import "dotenv/config";
import { StreamingSource } from "../interfaces/app.enum";
import { IClickableElement } from "../interfaces/app.interface";
import { EnvironmentConfig } from "../interfaces/environment.config";
export declare class AnthropicService extends LLMProviderService {
    environmentConfig: EnvironmentConfig;
    anthropic: Anthropic | null;
    bedrock: BedrockRuntimeClient;
    useBedrock: boolean;
    constructor();
    createInstances(config: {
        apiKey: string;
        useBedrock: boolean;
        AWS_REGION: string;
        AWS_ACCESS_KEY_ID: string;
        AWS_SECRET_ACCESS_KEY: string;
    }): void;
    setEnvironmentConfig(environmentConfig: EnvironmentConfig): void;
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
    destroy(): void;
}
