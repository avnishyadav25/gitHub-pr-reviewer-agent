
import * as dotenv from 'dotenv';
import { Reviewer } from './src/reviewer';

dotenv.config();

// Mocks for local run if keys are not present
// Real run requires .env file with GITHUB_TOKEN and OPENAI_API_KEY
async function run() {
    const inputs = {
        openaiKey: process.env.OPENAI_API_KEY || 'mock-key',
        githubToken: process.env.GITHUB_TOKEN || 'mock-token',
        model: 'gpt-4o',
        includeSeverity: 'info,warning,critical',
    };

    console.log('Starting Simulation...');

    // Note: This simulation tries to run the real Reviewer.
    // Without real keys and context, it will likely fail or skip.
    // To truly simulate, one would need to mock the environment variables that @actions/github reads (GITHUB_REPOSITORY, etc).

    process.env.GITHUB_REPOSITORY = 'avnishyadav25/gitHub-pr-reviewer-agent';
    process.env.GITHUB_EVENT_PATH = '/dev/null'; // Mock event path
    // We cannot easily mock the full context without a real payload file.

    console.log('Please configure .env and GITHUB_EVENT_PATH for full local simulation.');
    console.log('Or use the unit tests (which track logic).');

    try {
        const reviewer = new Reviewer(inputs);
        // await reviewer.start();
        console.log('Reviewer instantiated successfully.');
    } catch (e) {
        console.error(e);
    }
}

run();
