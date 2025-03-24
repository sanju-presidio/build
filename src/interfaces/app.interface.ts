import { ActionType } from "./app.enum";

export interface IClickableElement {
  type: string;
  tagName: string;
  text?: string;
  placeholder?: string;
  coordinate: { x: number; y: number };
  attributes: { [key in string]: string };
  isVisibleInCurrentViewPort: boolean;
  isVisuallyVisible: boolean;
}

export interface BrowserInferenceData {
  image: string;
  inference: IClickableElement[];
  totalScroll: number;
  scrollPosition: number;
  originalImage: string;
}
export interface ILLMSuggestedAction {
  actionType: ActionType;
  elementIndex: string;
  text: string;
  toolName: string;
  additionalInfo: string;
  task_status: string;
  question: string;
  genericText: string;
  url: string;
}

export interface IProcessedScreenshot {
  inference: IClickableElement[];
}

export interface IPlaywrightAction {
  actionType: ActionType;
  coordinate?: { x: number; y: number };
  text?: string;
  url?: string;
  element: IClickableElement | null;
}

export interface PerformTaskAdditionalParams {
  saveScreenshot: boolean;
}
