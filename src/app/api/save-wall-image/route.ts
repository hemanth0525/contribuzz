import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";

const GITHUB_TOKEN = process.env.GITHUB_PAT_TOKEN!;
const GITHUB_REPO = process.env.GITHUB_REPO!;
const GITHUB_OWNER = process.env.GITHUB_OWNER!;

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function getFileSha(filePath: string) {
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
    });
    if ("sha" in data) {
      return (data as { sha: string }).sha;
    }
    throw new Error("Unexpected response from GitHub API");
  } catch (error) {
    if (error instanceof RequestError && error.status === 404) return null; // File does not exist
    throw new Error(`GitHub API error (GET sha): ${(error as Error).message}`);
  }
}

async function uploadToGitHub(fileName: string, imageDataUrl: string) {
  const filePath = `public/walls/${fileName}`;
  const sha = await getFileSha(filePath);
  const commitMessage = sha ? `Update ${fileName}` : `Upload ${fileName}`;

  const response = await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: filePath,
    message: commitMessage,
    content: imageDataUrl.split(",")[1], // Strip the base64 prefix
    ...(sha && { sha }), // Only include `sha` if updating
  });

  return response.data.content?.html_url;
}

export async function POST(req: NextRequest) {
  try {
    const { fileName, imageDataUrl } = await req.json();

    if (!fileName.endsWith(".png")) {
      throw new Error("File name must end with .png");
    }

    const url = await uploadToGitHub(fileName, imageDataUrl);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error saving image:", error);
    const errorMessage = (error as Error).message;
    return NextResponse.json(
      { error: `Failed to save image: ${errorMessage}` },
      { status: 500 }
    );
  }
}
