export interface PullRequestContext {
    owner: string;
    repo: string;
    number: number;
}
export declare class GitHubClient {
    private octokit;
    constructor(token: string);
    getPullRequestContext(): PullRequestContext | null;
}
//# sourceMappingURL=github.d.ts.map