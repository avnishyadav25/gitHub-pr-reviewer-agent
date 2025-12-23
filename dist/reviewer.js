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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reviewer = void 0;
exports.defineReviewer = defineReviewer;
const core = __importStar(require("@actions/core"));
const github_1 = require("./github");
const openai_1 = require("./openai");
class Reviewer {
    constructor(inputs) {
        this.config = inputs;
        this.github = new github_1.GitHubClient(inputs.githubToken);
        this.openai = new openai_1.OpenAIClient(inputs.openaiKey, inputs.model);
    }
    async start() {
        core.info('Initializing review process...');
        // 1. Get PR Context
        const prContext = this.github.getPullRequestContext();
        if (!prContext) {
            core.warning('No Pull Request context found. Skipping review.');
            return;
        }
        core.info(`Reviewing PR #${prContext.number} in ${prContext.owner}/${prContext.repo}`);
        // 2. Fetch Diff
        core.info('Fetching PR diff...');
        const diff = await this.github.getDiff(prContext.owner, prContext.repo, prContext.number);
        if (!diff) {
            core.warning('Failed to fetch diff or diff is empty.');
            return;
        }
        core.debug(`Diff fetched. Length: ${diff.length} characters.`);
        // 3. Analyze with OpenAI
        core.info('Analyzing code with OpenAI...');
        const comments = await this.openai.analyzeDiff(diff);
        core.info(`Analysis complete. Found ${comments.length} issues.`);
        // 4. Post Review
        await this.github.postReview(prContext.owner, prContext.repo, prContext.number, comments);
    }
}
exports.Reviewer = Reviewer;
function defineReviewer(inputs) {
    return new Reviewer(inputs);
}
//# sourceMappingURL=reviewer.js.map