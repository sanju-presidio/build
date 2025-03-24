import { v4 as uuid } from "uuid";

import { IClickableElement } from "../interfaces/app.interface";
import {
  IConversation,
  IScreenshot,
} from "../interfaces/test-output.interface";

export function convertElementsToInput(
  availableElements: IClickableElement[],
): string {
  return availableElements
    .map(
      (element, index) =>
        `[${index}]: <${element.tagName} ${Object.entries(element.attributes)
          .map((attr) => `${attr[0]}="${attr[1]}"`)
          .join(
            " ",
          )}>${element.text}</${element.tagName}>: [${element.coordinate.x},${element.coordinate.y}]:[${element.isVisibleInCurrentViewPort ? (element.isVisuallyVisible ? "visible in the current viewport" : "Overlay by another element. Handle the overlay first. Visually identify the overlay element") : "Not available in current viewport. Available on scroll"}]`,
    )
    .join("\n");
}

export const formatCoordinate = (coordinate: string) => {
  const [x, y] = coordinate.split(",").map((c) => parseInt(c));
  return { x, y };
};

export const constructScreenshotOutput = (
  id: string,
  image: string,
): IScreenshot => {
  return {
    id,
    timestamp: new Date().toISOString(),
    description: "",
    image,
  };
};

export const constructConversation = (
  history: { role: string; message?: string; content?: string }[],
): IConversation[] => {
  return history.map((h) => ({
    role: h.role,
    message: h?.message || h?.content || "",
    id: uuid(),
  }));
};
