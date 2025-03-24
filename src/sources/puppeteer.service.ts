import { Browser, chromium, Page } from "playwright";
import { SourceService } from "./source.base";
import {
  BrowserInferenceData,
  IClickableElement,
} from "../interfaces/app.interface";
import { formatCoordinate } from "../utils/format-output.util";
export class PlaywrightService extends SourceService {
  private browser: Browser | null = null;
  private browserEventsCallback: Function | null = null;

  constructor() {
    super();
  }

  async captureScreenshotAndInfer(
    save: boolean = false,
  ): Promise<BrowserInferenceData> {
    const base64Image = await this.captureScreenshot(save);
    const elements: {
      clickableElements: IClickableElement[];
      inputElements: IClickableElement[];
    } = await this.getAllPageElements();

    const combinedElements = [
      ...elements.clickableElements,
      ...elements.inputElements,
    ];

    const page = this.getCurrentPage();
    let scrollPosition = 0;
    let totalScroll = 0;

    await page.evaluate(() => {
      scrollPosition = window.scrollY;
      totalScroll = document.body.scrollHeight;
    }, null);

    return {
      image: base64Image, //await markElements(base64Image, combinedElements),
      inference: combinedElements,
      scrollPosition,
      totalScroll,
      originalImage: base64Image,
    };
  }

  async captureScreenshot(save: boolean = true): Promise<string> {
    const page = this.getCurrentPage();

    const buffer = await page.screenshot({ type: "png" });
    const base64Image = buffer.toString("base64");

    console.log(`Screenshot captured`);

    return base64Image;
  }

  async launch(input: { url: string }): Promise<string> {
    let result = "";
    try {
      const { url } = input;
      if (!this.browser) {
        this.browser = await chromium.launch({
          headless: true,
        });
      }
      const context = await this.browser.newContext();
      const page = await context.newPage();

      await page.goto(url);
      this.listenBrowserEvents(this.browserEventsCallback as Function);
      result = `Page loaded: ${url}`;
    } catch (e) {
      console.error(e);
      result = `Page load failed. Could not launch browser. Please try again`;
    }
    return result;
  }

  async click(input: { coordinate: string }): Promise<string> {
    const page = this.getCurrentPage();
    const coordinate = formatCoordinate(input.coordinate);

    if (!coordinate) {
      return "Coordinates are required for click action";
    }

    let result = "";
    try {
      // await this.checkIfElementIsVisible(coordinate, page);
      await page.mouse.move(coordinate.x, coordinate.y);
      await page.mouse.click(coordinate.x, coordinate.y, {
        button: "left",
        clickCount: 1,
      });
      // Create a navigation promise that resolves on load or times out after 5 seconds
      await page.waitForLoadState("domcontentloaded", {
        timeout: 20_000,
      });

      result = "Click action performed successfully";
    } catch (e) {
      console.error("Click action error:", e);
      result = "Click action failed. Please retry";
    }
    return result;
  }

  async type(input: { text: string; coordinate: string }): Promise<string> {
    const { text } = input;
    const coordinate = formatCoordinate(input.coordinate);
    if (!text || !coordinate) {
      throw new Error("Text && coordinate is required for type action");
    }
    const context = this.browser!.contexts()[0];
    const page = context.pages()[0];
    await page.mouse.click(coordinate.x, coordinate.y, {
      button: "left",
      clickCount: 1,
    });
    await page.keyboard.type(text);
    return "Type action performed successfully";
  }

  async keyPress(input: { key: string; coordinate: string }): Promise<string> {
    const { key } = input;
    const coordinate = formatCoordinate(input.coordinate);
    const page = this.getCurrentPage();
    const isFocused = await this.isElementFocused(coordinate, page);
    let result = "";
    if (isFocused) {
      let newKey = key;
      if (key.includes("control")) {
        newKey = key.toLowerCase().replace("control", "ControlOrMeta");
      }
      await page.keyboard.press(newKey, { delay: 10 });
      result = "Keypress action performed successfully";
    } else {
      result = "Element is not focused. Please click on the element first.";
    }
    return result;
  }

  async scroll(input: { direction: "up" | "down" }): Promise<string> {
    const { direction } = input;

    const page = this.getCurrentPage();
    await page.mouse.wheel(0, direction == "up" ? -400 : 400);
    return "Scroll up action performed successfully";
  }

  async back() {
    const page = this.getCurrentPage();
    await page.goBack();
    return "Navigated back to previous screen";
  }

  async isElementFocused(
    coordinate: { x: number; y: number },
    page: Page,
  ): Promise<boolean> {
    return await page.evaluate((coordinate) => {
      const el = document.elementFromPoint(coordinate.x, coordinate.y);
      return el === document.activeElement;
    }, coordinate);
  }

  getCurrentPage(): Page {
    if (!this.browser) {
      throw new Error(
        "Browser is not launched. Please launch the browser first.",
      );
    }

    const context = this.browser.contexts()[0];
    return context.pages()[0];
  }

  async checkIfElementIsVisible(
    coordinate: { x: number; y: number },
    page: Page,
  ): Promise<{
    top?: number;
    isSuccess: boolean;
    isConditionPassed?: boolean;
    message?: string;
  } | null> {
    return page.evaluate((coordinate) => {
      let result: {
        top?: number;
        isSuccess: boolean;
        isConditionPassed?: boolean;
        message?: string;
      } | null = null;
      try {
        const element = document.elementFromPoint(coordinate.x, coordinate.y);
        if (element) {
          const { top } = element.getBoundingClientRect();
          if (top > window.innerHeight || top < window.scrollY) {
            element.scrollIntoView({ behavior: "smooth" });
          }

          result = {
            top,
            isSuccess: true,
            isConditionPassed: top > window.innerHeight || top < window.scrollY,
          };
        } else {
          result = {
            top: -1,
            isSuccess: false,
            isConditionPassed: false,
          };
        }
      } catch (e) {
        console.log(
          "Error while clicking on element. Please check if the element is visible in the current viewport",
          e,
        );
        result = {
          isSuccess: false,
          message:
            "Element not available on the visible viewport. Please check if the element is visible in the current viewport otherwise scroll the page to make the element visible in the viewport",
        };
      }
      return result;
    }, coordinate);
  }

  async getAllPageElements(): Promise<{
    clickableElements: Array<IClickableElement>;
    inputElements: Array<IClickableElement>;
  }> {
    const page = this.getCurrentPage();

    // Get all elements that are typically clickable or interactive
    const elements = await page.evaluate(() => {
      const clickableSelectors = `a, button, [role], [onclick], input[type="submit"], input[type="button"]`;
      const inputSelectors = `input:not([type="submit"]):not([type="button"]), textarea, [contenteditable="true"],select`;

      // Create Sets to store unique elements
      const uniqueClickableElements = Array.from(
        document.querySelectorAll(clickableSelectors),
      );
      const uniqueInputElements = Array.from(
        document.querySelectorAll(inputSelectors),
      );

      function checkIfElementIsVisuallyVisible(
        element: Element,
        centerX: number,
        centerY: number,
      ) {
        const topElement = document.elementFromPoint(centerX, centerY);
        return !(topElement !== element && !element.contains(topElement));
      }

      function elementVisibility(element: Element) {
        const isVisible = element.checkVisibility({
          checkOpacity: true,
          checkVisibilityCSS: true,
          contentVisibilityAuto: true,
          opacityProperty: true,
          visibilityProperty: true,
        });
        const style = getComputedStyle(element);
        const notHiddenByCSS =
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          parseFloat(style.opacity) > 0;
        const notHiddenAttribute = !(element as any).hidden;
        return isVisible && notHiddenByCSS && notHiddenAttribute;
      }

      function getElementInfo(element: Element) {
        const { top, left, bottom, right, width, height } =
          element.getBoundingClientRect();
        const attributes: Record<string, string> = {};
        const { innerHeight, innerWidth } = window;
        const isVisibleInCurrentViewPort =
          top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;

        // Get all attributes
        Array.from(element.attributes).forEach((attr) => {
          attributes[attr.name] = attr.value;
        });

        return elementVisibility(element)
          ? {
              type:
                element instanceof HTMLInputElement
                  ? element.type
                  : element.tagName.toLowerCase(),
              tagName: element.tagName.toLowerCase(),
              text: element.textContent?.trim(),
              placeholder: (element as HTMLInputElement).placeholder,
              coordinate: {
                x: Math.round(left + width / 2),
                y: Math.round(top + height / 2),
              },
              attributes,
              isVisibleInCurrentViewPort,
              isVisuallyVisible: checkIfElementIsVisuallyVisible(
                element,
                left + width / 2,
                top + height / 2,
              ),
            }
          : null;
      }

      return {
        clickableElements: Array.from(uniqueClickableElements)
          .map(getElementInfo)
          .filter((e) => e) as IClickableElement[],
        inputElements: Array.from(uniqueInputElements)
          .map(getElementInfo)
          .filter((e) => e) as IClickableElement[],
      };
    });

    return elements;
  }

  async getCurrentStateDetails(): Promise<BrowserInferenceData | null> {
    let inferenceData: BrowserInferenceData | null = null;
    if (this.browser) {
      inferenceData = await this.captureScreenshotAndInfer(false);
    }
    return inferenceData || null;
  }

  setBrowserEventsCallback(callback: Function) {
    this.browserEventsCallback = callback;
  }

  listenBrowserEvents(callback: Function) {
    const page = this.getCurrentPage();
    page.on("console", (msg) => {
      callback("console", {
        type: "console",
        level: msg.type(),
        text: msg.text(),
        location: msg.location(),
        timestamp: new Date().toISOString(),
      });
    });
    page.on("request", (request) => {
      callback("network_request", {
        type: "network",
        event: "request",
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        resourceType: request.resourceType(),
      });
    });
    page.on("response", async (response) => {
      try {
        const { status, headers, body } =
          await this.networkResponseProcessedInfo(response);
        callback("network_response", {
          type: "network",
          event: "response",
          url: response.url(),
          status,
          headers,
          body,
        });
      } catch (error) {
        console.error("Error processing response:", error);
      }
    });
  }

  private async networkResponseProcessedInfo(response: any) {
    const status = response.status();
    const headers = response.headers();
    let body = null;

    // Only try to get response body for text-based content
    const contentType = headers["content-type"] || "";
    if (contentType.includes("json") || contentType.includes("text")) {
      try {
        body = await response.text();
      } catch (e) {
        // Ignore body parsing errors
      }
    }
    return { status, headers, body };
  }

  destroy() {
    if (this.browser) {
      this.browser.close().then(() => {
        this.browser = null;
      });
    }
  }
}
