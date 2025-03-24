"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactifApp = exports.main = void 0;
// Export public API
var main_1 = require("./main");
Object.defineProperty(exports, "main", { enumerable: true, get: function () { return main_1.main; } });
var app_1 = require("./app");
Object.defineProperty(exports, "FactifApp", { enumerable: true, get: function () { return app_1.FactifApp; } });
__exportStar(require("./interfaces/test-output.interface"), exports);
__exportStar(require("./interfaces/app.enum"), exports);
__exportStar(require("./interfaces/app.interface"), exports);
__exportStar(require("./interfaces/environment.config"), exports);
