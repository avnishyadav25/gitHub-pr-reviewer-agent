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
exports.GitHubClient = void 0;
const github = __importStar(require("@actions/github"));
const core = __importStar(require("@actions/core"));
class GitHubClient {
    constructor(token) {
        this.octokit = github.getOctokit(token);
    }
    getPullRequestContext() {
        const context = github.context;
        if (context.payload.pull_request) {
            return {
                owner: context.repo.owner,
                repo: context.repo.repo,
                number: context.payload.pull_request.number,
            };
        }
        return null;
    }
    async getDiff(owner, repo, pullNumber) {
        try {
            const response = await this.octokit.rest.pulls.get({
                owner,
                repo,
                pull_number: pullNumber,
                mediaType: {
                    format: 'diff',
                },
            });
            return response.data;
        }
        catch (error) {
            core.error(`Error fetching diff: ${error}`);
            return null;
        }
    }
    async postReview(owner, repo, pullNumber, comments) {
        if (comments.length === 0) {
            core.info('No comments to post.');
            return;
        }
        const reviewBody = `AI Review completed. Found ${comments.length} potential issues.`;
        const githubComments = comments.map(c => ({
            path: c.file,
            line: c.lineNumber,
            body: `**[${c.severity.toUpperCase()}]** ${c.comment}`,
        }));
        try {
            await this.octokit.rest.pulls.createReview({
                owner,
                repo,
                pull_number: pullNumber,
                body: reviewBody,
                event: 'COMMENT',
                comments: githubComments,
            });
            core.info('Review posted successfully.');
        }
        catch (error) {
            core.error(`Failed to post review: ${error}`);
        }
    }
}
exports.GitHubClient = GitHubClient;
//# sourceMappingURL=github.js.map