
import { Reviewer } from '../src/reviewer';

// Define mocks before imports/mock calls
const mockGetPullRequestContext = jest.fn();
const mockGetDiff = jest.fn().mockImplementation((...args) => {
    console.log('MOCK getDiff called with:', args);
    return Promise.resolve('diff content');
});
const mockPostReview = jest.fn();
const mockAnalyzeDiff = jest.fn();

jest.mock('../src/github', () => {
    return {
        GitHubClient: jest.fn().mockImplementation(() => {
            return {
                getPullRequestContext: mockGetPullRequestContext,
                getDiff: mockGetDiff,
                postReview: mockPostReview,
            };
        }),
    };
});

jest.mock('../src/openai', () => {
    return {
        OpenAIClient: jest.fn().mockImplementation(() => {
            return {
                analyzeDiff: mockAnalyzeDiff,
            };
        }),
    };
});

describe('Reviewer', () => {
    let reviewer: Reviewer;

    const inputs = {
        openaiKey: 'test-key',
        githubToken: 'test-token',
        model: 'gpt-4o',
        includeSeverity: 'info',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        reviewer = new Reviewer(inputs);
    });

    it('should start the review process and post comments', async () => {
        const mockDiff = 'diff content';
        const mockComments = [{ file: 'test.ts', lineNumber: 10, comment: 'issue', severity: 'warning' }];

        mockGetPullRequestContext.mockReturnValue({
            owner: 'owner',
            repo: 'repo',
            number: 1,
        });
        mockGetDiff.mockResolvedValue(mockDiff);
        mockAnalyzeDiff.mockResolvedValue(mockComments);

        await reviewer.start();

        expect(mockGetPullRequestContext).toHaveBeenCalled();
        expect(mockGetDiff).toHaveBeenCalledWith('owner', 'repo', 1);
        expect(mockAnalyzeDiff).toHaveBeenCalledWith(mockDiff);
        expect(mockPostReview).toHaveBeenCalledWith('owner', 'repo', 1, mockComments);
    });

    it('should skip review if no context found', async () => {
        mockGetPullRequestContext.mockReturnValue(null);

        await reviewer.start();

        expect(mockGetPullRequestContext).toHaveBeenCalled();
        expect(mockGetDiff).not.toHaveBeenCalled();
    });

    it('should skip analysis if diff is empty', async () => {
        mockGetPullRequestContext.mockReturnValue({
            owner: 'owner',
            repo: 'repo',
            number: 1,
        });
        mockGetDiff.mockResolvedValue(null);

        await reviewer.start();

        expect(mockGetDiff).toHaveBeenCalled();
        expect(mockAnalyzeDiff).not.toHaveBeenCalled();
    });
});
