// app/api/fetchContributors/route.ts

import { NextRequest, NextResponse } from 'next/server';

// POST handler to fetch contributors from a GitHub repository
export async function POST(req: NextRequest) {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    // Check if GitHub token is configured
    if (!GITHUB_TOKEN) {
        return NextResponse.json(
            { message: 'GitHub token not configured' },
            { status: 500 }
        );
    }

    try {
        // Parse the request body to get the repository URL
        const { repoUrl } = await req.json();
        if (!repoUrl) {
            return NextResponse.json(
                { message: 'Repository URL not provided' },
                { status: 400 }
            );
        }

        // Extract owner and repository name from the URL
        const [owner, repoName] = repoUrl.split('/');
        if (!owner || !repoName) {
            return NextResponse.json(
                { message: 'Invalid repository URL format. Use "owner/repoName".' },
                { status: 400 }
            );
        }

        // Fetch the list of contributors from the GitHub API
        const contributorsRes = await fetch(
            `https://api.github.com/repos/${owner}/${repoName}/contributors?per_page=100`,
            {
                headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
            }
        );

        // Handle errors from the GitHub API
        if (!contributorsRes.ok) {
            const errorData = await contributorsRes.json();
            return NextResponse.json(
                { message: `Error ${contributorsRes.status}: ${errorData.message}` },
                { status: contributorsRes.status }
            );
        }

        const contributors = await contributorsRes.json();

        // Fetch detailed information for each contributor
        const detailedContributors = await Promise.all(
            contributors.map(async (contributor: { login: string; avatar_url: string; contributions: number; html_url: string; url: string }) => {
                const userRes = await fetch(contributor.url, {
                    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
                });

                // If user details fetch fails, return basic contributor info
                if (!userRes.ok) {
                    return {
                        login: contributor.login,
                        avatar_url: contributor.avatar_url,
                        contributions: contributor.contributions,
                        html_url: contributor.html_url,
                    };
                }

                const userData = await userRes.json();
                return {
                    login: contributor.login,
                    avatar_url: userData.avatar_url,
                    contributions: contributor.contributions,
                    html_url: contributor.html_url,
                    name: userData.name,
                    bio: userData.bio,
                    location: userData.location,
                };
            })
        );

        // Return the detailed contributors list, limited to 100 entries
        return NextResponse.json(detailedContributors.slice(0, 100));
    } catch (error) {
        console.error('Error fetching contributors:', error);
        return NextResponse.json(
            { message: 'Failed to fetch contributors' },
            { status: 500 }
        );
    }
}
