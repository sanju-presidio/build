import { StreamingSource } from "../interfaces/app.enum";
import { IClickableElement } from "../interfaces/app.interface";

export abstract class LLMProviderService {
  abstract performTask(
    source: StreamingSource,
    history: any[],
    originalImage?: string,
    elements?: IClickableElement[] | null | undefined,
    model?: string,
    retryCount?: number,
  ): Promise<Array<any>>;

  abstract transform(toolResponse: Array<any>): Array<any>;
  abstract destroy(): void;
}
