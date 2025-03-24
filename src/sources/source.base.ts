import { BrowserInferenceData } from "../interfaces/app.interface";

export abstract class SourceService {
  abstract captureScreenshot(): Promise<string>;
  abstract getCurrentStateDetails(): Promise<BrowserInferenceData | null>;
  
  abstract launch(input: { url: string }): Promise<string>;
  abstract click(input: { coordinate: string }): Promise<string>;
  abstract type(input: { text: string; coordinate: string }): Promise<string>;
  abstract keyPress(input: { key: string; coordinate: string }): Promise<string>;
  abstract scroll(input: { direction: "up" | "down" }): Promise<string>;
  abstract back(): Promise<string>;
}
