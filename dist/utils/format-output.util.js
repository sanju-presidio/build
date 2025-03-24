"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructConversation = exports.constructScreenshotOutput = exports.formatCoordinate = void 0;
exports.convertElementsToInput = convertElementsToInput;
const uuid_1 = require("uuid");
function convertElementsToInput(availableElements) {
    return availableElements
        .map((element, index) => `[${index}]: <${element.tagName} ${Object.entries(element.attributes)
        .map((attr) => `${attr[0]}="${attr[1]}"`)
        .join(" ")}>${element.text}</${element.tagName}>: [${element.coordinate.x},${element.coordinate.y}]:[${element.isVisibleInCurrentViewPort ? (element.isVisuallyVisible ? "visible in the current viewport" : "Overlay by another element. Handle the overlay first. Visually identify the overlay element") : "Not available in current viewport. Available on scroll"}]`)
        .join("\n");
}
const formatCoordinate = (coordinate) => {
    const [x, y] = coordinate.split(",").map((c) => parseInt(c));
    return { x, y };
};
exports.formatCoordinate = formatCoordinate;
const constructScreenshotOutput = (id, image) => {
    return {
        id,
        timestamp: new Date().toISOString(),
        description: "",
        image,
    };
};
exports.constructScreenshotOutput = constructScreenshotOutput;
const constructConversation = (history) => {
    return history.map((h) => ({
        role: h.role,
        message: (h === null || h === void 0 ? void 0 : h.message) || (h === null || h === void 0 ? void 0 : h.content) || "",
        id: (0, uuid_1.v4)(),
    }));
};
exports.constructConversation = constructConversation;
