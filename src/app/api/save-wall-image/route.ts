import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";

const GITHUB_TOKEN = process.env.GITHUB_PAT_TOKEN!;
const GITHUB_REPO = process.env.GITHUB_REPO!;
const GITHUB_OWNER = process.env.GITHUB_OWNER!;

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function getFileSha(filePath: string): Promise<string | null> {
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
    });

    if (data && !Array.isArray(data) && data.type === "file") {
      return data.sha;
    }
  } catch (error) {
    if (error instanceof RequestError && error.status === 404) {
      return null; // File does not exist
    }
    throw error;
  }
  return null; // Return null if no other return statement is hit
}

async function uploadToGitHub(fileName: string, imageDataUrl: string) {
  const filePath = `public/walls/${fileName}`;
  const sha = await getFileSha(filePath);
  const commitMessage = sha ? `Update ${fileName}` : `Upload ${fileName}`;

  // Decode the Base64 content before uploading
  const content = imageDataUrl.split(",")[1]; // Get the Base64 part
  const response = await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: filePath,
    message: commitMessage,
    content, // Base64 content
    ...(sha && { sha }), // Include `sha` if updating
  });

  return response.data.content?.html_url;
}

export async function POST(req: NextRequest) {
  try {
    const { fileName, imageDataUrl } = await req.json();

    // Validate file extension
    if (!fileName.endsWith(".png")) {
      throw new Error("File name must end with .png");
    }

    // Validate that the imageDataUrl is a valid data URL
    const isValidDataUrl = /^data:image\/png;base64,/.test(imageDataUrl);
    if (!isValidDataUrl) {
      throw new Error("Invalid image data URL");
    }

    // Upload the image and get the URL
    const url = await uploadToGitHub(fileName, imageDataUrl);
    return NextResponse.json({ url });
  } catch (error: unknown) {
    console.error("Error saving image:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to save image: ${error.message}` },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to save image: Unknown error" },
        { status: 500 }
      );
    }
  }
}
