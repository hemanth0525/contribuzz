// app/api/save-avatar-wall/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";

// Environment variables for GitHub authentication and repository details
const GITHUB_TOKEN = process.env.GITHUB_PAT_TOKEN!;
const GITHUB_REPO = process.env.GITHUB_REPO!;
const GITHUB_OWNER = process.env.GITHUB_OWNER!;

// Initialize Octokit with the GitHub token
const octokit = new Octokit({ auth: GITHUB_TOKEN });

/**
 * Get the SHA of a file in the GitHub repository.
 * @param filePath - The path to the file in the repository.
 * @returns The SHA of the file, or null if the file does not exist.
 */
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
    return null;
}

/**
 * Upload an image to the GitHub repository.
 * @param fileName - The name of the file to be uploaded.
 * @param imageDataUrl - The Base64 encoded image data URL.
 * @returns The URL of the uploaded file in the repository.
 */
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
        content,
        ...(sha && { sha }),
    });

    return response.data.content?.html_url;
}

/**
 * Handle POST requests to save an avatar wall image.
 * @param req - The incoming request object.
 * @returns A response object with the result of the operation.
 */
export async function POST(req: NextRequest) {
    try {
        const { fileName, imageDataUrl } = await req.json();

        // Validate file extension
        if (!fileName.endsWith(".png")) {
            throw new Error("Invalid file name. Avatar wall image should be .png");
        }

        // Validate that the imageDataUrl is a valid data URL
        const isValidDataUrl = /^data:image\/png;base64,/.test(imageDataUrl);
        if (!isValidDataUrl) {
            throw new Error("Invalid image data URL");
        }

        // Check the size of the Base64 encoded image data
        const base64Size = (imageDataUrl.length - imageDataUrl.indexOf(",") - 1) * 0.75;
        const maxSize = 4.5 * 1024 * 1024; // 4.5 MB in bytes
        if (base64Size > maxSize) {
            throw new Error("Image size exceeds 4.5 MB");
        }

        // Upload the image
        const url = await uploadToGitHub(fileName, imageDataUrl);

        return NextResponse.json({
            url,
            message: "Avatar wall image saved successfully"
        });
    } catch (error: unknown) {
        console.error("Error saving avatar wall image:", error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to save avatar wall image: Unknown error",
            },
            { status: 500 }
        );
    }
}