import { IClickableElement } from "../interfaces/app.interface";
import { IConversation, IScreenshot } from "../interfaces/test-output.interface";
export declare function convertElementsToInput(availableElements: IClickableElement[]): string;
export declare const formatCoordinate: (coordinate: string) => {
    x: number;
    y: number;
};
export declare const constructScreenshotOutput: (id: string, image: string) => IScreenshot;
export declare const constructConversation: (history: {
    role: string;
    message?: string;
    content?: string;
}[]) => IConversation[];
