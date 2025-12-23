import * as core from '@actions/core';
import { GitHubClient } from './github';
import { OpenAIClient } from './openai';

interface ReviewerInputs {
    openaiKey: string;
    githubToken: string;
    model: string;
    includeSeverity: string;
}

export class Reviewer {
    private github: GitHubClient;
    private openai: OpenAIClient;
    private config: ReviewerInputs;

    constructor(inputs: ReviewerInputs) {
        this.config = inputs;
        this.github = new GitHubClient(inputs.githubToken);
        this.openai = new OpenAIClient(inputs.openaiKey, inputs.model);
    }

    async start(): Promise<void> {
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

export function defineReviewer(inputs: ReviewerInputs): Reviewer {
    return new Reviewer(inputs);
}
