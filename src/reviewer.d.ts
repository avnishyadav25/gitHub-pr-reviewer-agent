interface ReviewerInputs {
    openaiKey: string;
    githubToken: string;
    model: string;
    includeSeverity: string;
}
export declare class Reviewer {
    private github;
    private openai;
    private config;
    constructor(inputs: ReviewerInputs);
    start(): Promise<void>;
}
export declare function defineReviewer(inputs: ReviewerInputs): Reviewer;
export {};
//# sourceMappingURL=reviewer.d.ts.map