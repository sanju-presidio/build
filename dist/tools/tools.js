"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteTaskAction = exports.ScrollAction = exports.KeyPressAction = exports.TypeAction = exports.ClickAction = exports.LaunchAction = exports.BaseTool = void 0;
class BaseTool {
    constructor() {
        this.getToolSchema = () => ({
            name: this.name,
            description: this.description,
            input_schema: this.inputSchema,
        });
        this.getOpenAISchema = () => ({
            type: "function",
            function: {
                name: this.name,
                description: this.description,
                parameters: { ...this.inputSchema, additionalProperties: false },
                strict: true,
            },
        });
    }
}
exports.BaseTool = BaseTool;
class LaunchAction extends BaseTool {
    constructor() {
        super(...arguments);
        this.name = "launch";
        this.description = "Launch a new browser instance at the specified URL. Use with \`url\` parameter. URL must include protocol (https://, file://, etc.).";
        this.inputSchema = {
            type: "object",
            properties: {
                url: {
                    type: "string",
                    description: "URL for 'launch' action",
                },
            },
            required: ["url"],
        };
    }
}
exports.LaunchAction = LaunchAction;
class ClickAction extends BaseTool {
    constructor() {
        super(...arguments);
        this.name = "click";
        this.description = "To perform single click on the element";
        this.inputSchema = {
            type: "object",
            properties: {
                coordinate: {
                    type: "string",
                    description: "X,Y coordinates of the element in which the action has to perform. Coordinate should be from the center of the element.",
                },
            },
            required: ["coordinate"],
        };
    }
}
exports.ClickAction = ClickAction;
class TypeAction extends BaseTool {
    constructor() {
        super(...arguments);
        this.name = "type";
        this.description = "Type a string of text on the keyboard. Before typing, ensure the correct input field is selected/focused and field is empty.";
        this.inputSchema = {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Text to type",
                },
                coordinate: {
                    type: "string",
                    description: "X,Y coordinates of the element in which the action has to perform. Coordinate should be from the center of the element.",
                },
            },
            required: ["text", "coordinate"],
        };
    }
}
exports.TypeAction = TypeAction;
class KeyPressAction extends BaseTool {
    constructor() {
        super(...arguments);
        this.name = "keyPress";
        this.description = "Press a specific keyboard key. Only use on clearly interactive elements.";
        this.inputSchema = {
            type: "object",
            properties: {
                key: {
                    type: "string",
                    description: "Key to press, e.g., 'Enter', 'Backspace', 'Tab', 'Control+A.",
                },
                coordinate: {
                    type: "string",
                    description: "X,Y coordinates of the element in which the action has to perform. Coordinate should be from the center of the element.",
                },
            },
            required: ["key", "coordinate"],
        };
    }
}
exports.KeyPressAction = KeyPressAction;
class ScrollAction extends BaseTool {
    constructor() {
        super(...arguments);
        this.name = "scroll";
        this.description = "Scroll the viewport. Always verify element visibility after scrolling.";
        this.inputSchema = {
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
}
exports.ScrollAction = ScrollAction;
class CompleteTaskAction extends BaseTool {
    constructor() {
        super(...arguments);
        this.name = "completeTask";
        this.description = "After each tool use, the user will respond with the result of that tool use, i.e. if it succeeded or failed, along with any reasons for failure. Once you've received the results of tool uses and can confirm that the task is complete, use this tool to present the result of your work to the user. Optionally you may provide a CLI command to showcase the result of your work. The user may respond with feedback if they are not satisfied with the result, which you can use to make improvements and try again.";
        this.inputSchema = {
            type: "object",
            properties: {
                result: {
                    type: "string",
                    description: "The result of the task. Formulate this result in a way that is final and does not require further input from the user. Don't end your result with questions or offers for further assistance.",
                },
                status: {
                    type: "string",
                    description: "The status of the task. it should be either 'success' or 'failure'. if you complete the given task without any error then status should be 'success' otherwise 'failure'.",
                },
            },
            required: ["status", "result"],
        };
    }
}
exports.CompleteTaskAction = CompleteTaskAction;
