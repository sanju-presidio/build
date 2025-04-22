import {tool} from "@langchain/core/tools";
import {z} from "zod";
import {PlaywrightService} from "../sources/puppeteer.service";

export abstract class BaseTool {
  abstract name: string;
  abstract description: string;
  abstract inputSchema: Object;
  getToolSchema = () => ({
    name: this.name,
    description: this.description,
    input_schema: this.inputSchema,
  });
  getOpenAISchema = () => ({
    type: "function",
    function: {
      name: this.name,
      description: this.description,
      parameters: {...this.inputSchema, additionalProperties: false},
      strict: true,
    },
  });
}

export const launchActionTool = tool(async ({mode, url}) => {
    if (mode === 'PUPPETEER') {
      const instance = PlaywrightService.getInstance()
      await instance.launch({url})
    }
  },
  {
    name: 'launch',
    description: "Launch a new browser instance at the specified URL. Use with \`url\` parameter. URL must include protocol (https://, file://, etc.).",
    schema: z.object({
      url: z.string().describe("URL for 'launch' action"),
      mode: z.enum(['PUPPETEER', 'DOCKER']).describe('The environment type in which the actions are performing').default('PUPPETEER')
    })
  })

export const clickActionTool = tool(async ({coordinate, mode}) => {
    if (mode === 'PUPPETEER') {
      const instance = PlaywrightService.getInstance()
      await instance.click({coordinate})
    }
  },
  {
    name: 'click',
    description: 'To perform single click on the element',
    schema: z.object({
      coordinate: z.string().describe("X,Y coordinates of the element in which the action has to perform. Coordinate should be from the center of the element."),
      mode: z.enum(['PUPPETEER', 'DOCKER']).describe('The environment type in which the actions are performing').default('PUPPETEER')
    })
  })

export const typeActionTool = tool(async ({text, coordinate, mode}) => {
  if (mode === 'PUPPETEER') {
    const instance = PlaywrightService.getInstance()
    await instance.type({coordinate, text})
  }
}, {
  name: 'type',
  description: "Type a string of text on the keyboard. Before typing, ensure the correct input field is selected/focused and field is empty.",
  schema: z.object({
    text: z.string().describe("Text to type"),
    coordinate: z.string().describe("X,Y coordinates of the element in which the action has to perform. Coordinate should be from the center of the element."),
    mode: z.enum(['PUPPETEER', 'DOCKER']).describe('The environment type in which the actions are performing').default('PUPPETEER')
  })
})

export const keyPressActionTool = tool(async ({mode, coordinate, key}) => {
    if (mode === 'PUPPETEER') {
      const instance = PlaywrightService.getInstance()
      await instance.keyPress({coordinate, key})
    }
  },
  {
    name: 'keyPress',
    description: 'Press a specific keyboard key. Only use on clearly interactive elements.',
    schema: z.object({
      key: z.string().describe("Key to press, e.g., 'Enter', 'Backspace', 'Tab', 'Control+A."),
      coordinate: z.string().describe("X,Y coordinates of the element in which the action has to perform. Coordinate should be from the center of the element."),
      mode: z.enum(['PUPPETEER', 'DOCKER']).describe('The environment type in which the actions are performing').default('PUPPETEER')
    })
  })

export const scrollActionTool = tool(async ({direction, mode}) => {
    if (mode === 'PUPPETEER') {
      const instance = PlaywrightService.getInstance()
      await instance.scroll({direction})
    }
  },
  {
    name: "scroll",
    description: "Scroll the viewport. Always verify element visibility after scrolling.",
    schema: z.object({
      direction: z.enum(['up', 'down']).describe("Direction to scroll"),
      mode: z.enum(['PUPPETEER', 'DOCKER']).describe('The environment type in which the actions are performing').default('PUPPETEER')
    })
  })


export const completeActionTool = tool(async () => {
  },
  {
    name: "completeTask",
    description: "After each tool use, the user will respond with the result of that tool use, i.e. if it succeeded or failed, along with any reasons for failure. Once you've received the results of tool uses and can confirm that the task is complete, use this tool to present the result of your work to the user. Optionally you may provide a CLI command to showcase the result of your work. The user may respond with feedback if they are not satisfied with the result, which you can use to make improvements and try again.",
    schema: z.object({
      result: z.string().describe("The result of the task. Formulate this result in a way that is final and does not require further input from the user. Don't end your result with questions or offers for further assistance."),
      status: z.string().describe("The status of the task. it should be either 'success' or 'failure'. if you complete the given task without any error then status should be 'success' otherwise 'failure'.")
    })
  })


export class LaunchAction extends BaseTool {
  name = "launch";
  inputSchema = {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: "URL for 'launch' action",
      },
    },
    required: ["url"],
  };
  description =
    "Launch a new browser instance at the specified URL. Use with \`url\` parameter. URL must include protocol (https://, file://, etc.).";
}

export class ClickAction extends BaseTool {
  name = "click";
  description = "To perform single click on the element";
  inputSchema = {
    type: "object",
    properties: {
      coordinate: {
        type: "string",
        description:
          "X,Y coordinates of the element in which the action has to perform. Coordinate should be from the center of the element.",
      },
    },
    required: ["coordinate"],
  };
}

export class TypeAction extends BaseTool {
  name = "type";
  description =
    "Type a string of text on the keyboard. Before typing, ensure the correct input field is selected/focused and field is empty.";
  inputSchema = {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "Text to type",
      },
      coordinate: {
        type: "string",
        description:
          "X,Y coordinates of the element in which the action has to perform. Coordinate should be from the center of the element.",
      },
    },
    required: ["text", "coordinate"],
  };
}

export class KeyPressAction extends BaseTool {
  name = "keyPress";
  description =
    "Press a specific keyboard key. Only use on clearly interactive elements.";
  inputSchema = {
    type: "object",
    properties: {
      key: {
        type: "string",
        description:
          "Key to press, e.g., 'Enter', 'Backspace', 'Tab', 'Control+A.",
      },
      coordinate: {
        type: "string",
        description:
          "X,Y coordinates of the element in which the action has to perform. Coordinate should be from the center of the element.",
      },
    },
    required: ["key", "coordinate"],
  };
}

export class ScrollAction extends BaseTool {
  name = "scroll";
  description =
    "Scroll the viewport. Always verify element visibility after scrolling.";
  inputSchema = {
    type: "object",
    properties: {
      direction: {
        type: "string",
        description: "Direction to scroll",
      },
    },
    required: ["direction"],
  };
}

export class CompleteTaskAction extends BaseTool {
  name = "completeTask";
  description =
    "After each tool use, the user will respond with the result of that tool use, i.e. if it succeeded or failed, along with any reasons for failure. Once you've received the results of tool uses and can confirm that the task is complete, use this tool to present the result of your work to the user. Optionally you may provide a CLI command to showcase the result of your work. The user may respond with feedback if they are not satisfied with the result, which you can use to make improvements and try again.";
  inputSchema = {
    type: "object",
    properties: {
      result: {
        type: "string",
        description:
          "The result of the task. Formulate this result in a way that is final and does not require further input from the user. Don't end your result with questions or offers for further assistance.",
      },
      status: {
        type: "string",
        description:
          "The status of the task. it should be either 'success' or 'failure'. if you complete the given task without any error then status should be 'success' otherwise 'failure'.",
      },
    },
    required: ["status", "result"],
  };
}
