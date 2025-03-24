import { ITestOutput } from "./interfaces/test-output.interface";
import { PlaywrightService } from "./sources/puppeteer.service";
import { ProviderService } from "./LLM/provider.map";
import { EnvironmentConfig } from "./interfaces/environment.config";
export declare class FactifApp {
    providerService: ProviderService;
    sourceObject: PlaywrightService;
    testOutput: ITestOutput;
    environmentConfig: EnvironmentConfig;
    constructor(loadConfig: EnvironmentConfig);
    run(task: string): Promise<ITestOutput | undefined>;
    captureBrowserEvents(event: string, payload: any): void;
    executeTask(sourceObject: any, provider: any, history: any[]): Promise<any>;
    processLLMResponse(response: Array<any>, sourceObject: PlaywrightService, history: {
        role: string;
        message?: string;
        content?: string;
    }[]): Promise<{
        history: {
            role: string;
            message?: string;
            content?: string;
        }[];
        isTaskComplete: boolean;
    }>;
    onTaskComplete(content: any, history: {
        role: string;
        message?: string;
        content?: string;
    }[], testOutput: ITestOutput): ITestOutput;
}
