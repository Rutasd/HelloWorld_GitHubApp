const fs = require('fs');
const { App, Octokit } = require('@octokit/app');
const { createNodeMiddleware, createProbot } = require('@octokit/app/lib/probot');

// Load the private key and initialize the app
const privateKey = fs.readFileSync('ruta-s-helloworld-github-app.2023-07-13.private-key.pem');
const APP_ID = 360948; // Replace with your GitHub App's ID
const WEBHOOK_SECRET = 'webhooksecret'; // Replace with your webhook secret
const app = new App({ id: APP_ID, privateKey });

// Set up the webhook event listener
const webhookMiddleware = createNodeMiddleware(app, { secret: WEBHOOK_SECRET });
const probot = createProbot(webhookMiddleware);
probot.on('issues.opened', async (context) => {
  const { owner, repo, number } = context.issue();
  const octokit = new Octokit({ auth: await app.getInstallationAccessToken({ owner, repo }) });
  await octokit.issues.createComment({ owner, repo, issue_number: number, body: 'Hello, world!' });
});

// Start the server and listen for incoming webhook events
probot.start();
