// app/api/githubRepo/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Handler for POST requests to the GitHub repository endpoint
export async function POST(req: NextRequest) {
    try {
        // Parse the request body to get the repository information
        const { repo } = await req.json();

        // Check if the repository is specified in the request
        if (!repo) {
            return NextResponse.json({ message: 'Repository not specified' }, { status: 400 });
        }

        // Retrieve the GitHub token from environment variables
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        if (!GITHUB_TOKEN) {
            return NextResponse.json({ message: 'GitHub token not configured' }, { status: 500 });
        }

        // Split the repository string to get the owner and repository name
        const [owner, repoName] = repo.split('/');
        
        // Fetch repository details from GitHub API
        const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
            },
        });

        // Check if the response from GitHub API is not successful
        if (!response.ok) {
            let errorData;
            try {
                // Attempt to parse the response JSON
                errorData = await response.json();
            } catch {
                // Provide fallback if parsing fails
                errorData = { message: 'Unknown error from GitHub API' };
            }
            return NextResponse.json({ message: errorData.message }, { status: response.status });
        }

        // Parse the successful response JSON
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        // Handle unexpected errors
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}
