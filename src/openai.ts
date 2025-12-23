import OpenAI from 'openai';

export class OpenAIClient {
    private client: OpenAI;
    private model: string;

    constructor(apiKey: string, model: string) {
        this.client = new OpenAI({ apiKey });
        this.model = model;
    }

    async analyzeDiff(diff: string): Promise<any[]> {
        if (!diff) return [];

        const systemPrompt = `You are an expert code reviewer. Analyze the provided git diff.
Identify bugs, security vulnerabilities, and major code style issues.
Return the result as a JSON array of objects with the following keys:
- file: (string) the file path
- lineNumber: (number) the line number in the new file where the issue is
- comment: (string) a concise explanation of the issue
- severity: (string) one of "info", "warning", "critical"

If no issues are found, return an empty array.
Output ONLY valid JSON.`;

        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: diff },
                ],
                response_format: { type: 'json_object' },
            });

            const content = response.choices[0].message.content;
            if (!content) return [];

            const result = JSON.parse(content);
            return result.reviews || result; // Handle both { review: [] } or []
        } catch (error) {
            console.error('Error analyzing diff with OpenAI:', error);
            return [];
        }
    }
}
