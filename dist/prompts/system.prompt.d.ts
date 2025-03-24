import { IClickableElement } from "../interfaces/app.interface";
import { StreamingSource } from "../interfaces/app.enum";
export declare const BASE_SYSTEM_PROMPT: (isMarkedScreenshotAvailable: boolean) => string;
export declare const getSystemPrompt: (source: StreamingSource, elements?: IClickableElement[]) => string;
