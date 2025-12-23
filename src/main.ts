import * as core from '@actions/core';
import { defineReviewer } from './reviewer';

async function run(): Promise<void> {
    try {
        const inputs = {
            openaiKey: core.getInput('openai_key', { required: true }),
            githubToken: core.getInput('github_token', { required: true }),
            model: core.getInput('model') || 'gpt-4o',
            includeSeverity: core.getInput('include_severity') || 'info,warning,critical',
        };

        core.info(`Starting AI PR Reviewer with model: ${inputs.model}`);

        const reviewer = defineReviewer(inputs);
        await reviewer.start();

        core.info('Review completed successfully.');
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        } else {
            core.setFailed('Unknown error occurred');
        }
    }
}

run();
