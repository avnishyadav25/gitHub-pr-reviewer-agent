"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIClient = void 0;
const openai_1 = __importDefault(require("openai"));
class OpenAIClient {
    client;
    model;
    constructor(apiKey, model) {
        this.client = new openai_1.default({ apiKey });
        this.model = model;
    }
}
exports.OpenAIClient = OpenAIClient;
//# sourceMappingURL=openai.js.map