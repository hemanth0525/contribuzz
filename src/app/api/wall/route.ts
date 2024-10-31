// app/api/wall/route.ts

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Handles GET requests to fetch an image based on the provided repository name.
 * 
 * @param {Request} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(req: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);
        const repo = searchParams.get("repo");
        const onlyAvatars = searchParams.get("onlyAvatars") === "true";

        console.log(`Repo parameter: ${repo}`);
        console.log(`OnlyAvatars parameter: ${onlyAvatars}`);

        // Validate the 'repo' parameter
        if (!repo) {
            return NextResponse.json(
                { error: "Repo parameter is missing" },
                { status: 400 }
            );
        }

        // Sanitize the repository name to create a valid file name
        const sanitizedRepo = repo.replace("/", "-").toLowerCase();
        const fileName = onlyAvatars ? `${sanitizedRepo}(avatars).png` : `${sanitizedRepo}.jpg`;
        const imagePath = path.join(
            process.cwd(),
            "public",
            "walls",
            fileName
        );

        console.log(`Checking if image exists at path: ${imagePath}`);

        // Check if the image exists
        if (fs.existsSync(imagePath)) {
            const absoluteUrl = `${new URL(req.url).protocol}//${req.headers.get(
                "host"
            )}/walls/${fileName}`;
            console.log(`Image found, redirecting to ${absoluteUrl}`);
            return NextResponse.redirect(absoluteUrl);
        } else {
            console.log("Image not found");
            return NextResponse.json({ error: "Image not found" }, { status: 404 });
        }
    } catch (error: unknown) {
        console.error("Error handling request:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Internal Server Error", details: errorMessage },
            { status: 500 }
        );
    }
}
