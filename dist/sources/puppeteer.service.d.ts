import { Page } from "playwright";
import { SourceService } from "./source.base";
import { BrowserInferenceData, IClickableElement } from "../interfaces/app.interface";
export declare class PlaywrightService extends SourceService {
    private browser;
    private browserEventsCallback;
    constructor();
    captureScreenshotAndInfer(save?: boolean): Promise<BrowserInferenceData>;
    captureScreenshot(save?: boolean): Promise<string>;
    launch(input: {
        url: string;
    }): Promise<string>;
    click(input: {
        coordinate: string;
    }): Promise<string>;
    type(input: {
        text: string;
        coordinate: string;
    }): Promise<string>;
    keyPress(input: {
        key: string;
        coordinate: string;
    }): Promise<string>;
    scroll(input: {
        direction: "up" | "down";
    }): Promise<string>;
    back(): Promise<string>;
    isElementFocused(coordinate: {
        x: number;
        y: number;
    }, page: Page): Promise<boolean>;
    getCurrentPage(): Page;
    checkIfElementIsVisible(coordinate: {
        x: number;
        y: number;
    }, page: Page): Promise<{
        top?: number;
        isSuccess: boolean;
        isConditionPassed?: boolean;
        message?: string;
    } | null>;
    getAllPageElements(): Promise<{
        clickableElements: Array<IClickableElement>;
        inputElements: Array<IClickableElement>;
    }>;
    getCurrentStateDetails(): Promise<BrowserInferenceData | null>;
    setBrowserEventsCallback(callback: Function): void;
    listenBrowserEvents(callback: Function): void;
    private networkResponseProcessedInfo;
    destroy(): void;
}
