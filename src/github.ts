import * as github from '@actions/github';
import * as core from '@actions/core';

export interface PullRequestContext {
    owner: string;
    repo: string;
    number: number;
}

export class GitHubClient {
    private octokit: ReturnType<typeof github.getOctokit>;

    constructor(token: string) {
        this.octokit = github.getOctokit(token);
    }

    getPullRequestContext(): PullRequestContext | null {
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

    async getDiff(owner: string, repo: string, pullNumber: number): Promise<string | null> {
        try {
            const response = await this.octokit.rest.pulls.get({
                owner,
                repo,
                pull_number: pullNumber,
                mediaType: {
                    format: 'diff',
                },
            });
            return response.data as unknown as string;
        } catch (error) {
            core.error(`Error fetching diff: ${error}`);
            return null;
        }
    }

    async postReview(owner: string, repo: string, pullNumber: number, comments: any[]): Promise<void> {
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
        } catch (error) {
            core.error(`Failed to post review: ${error}`);
        }
    }
}
