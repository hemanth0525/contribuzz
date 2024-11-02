// app/api/wall/route.ts

import { NextResponse } from "next/server";

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

        // Construct the jsDelivr URL for the images
        const sanitizedRepo = repo.replace("/", "-").toLowerCase();
        const fileName = onlyAvatars ? `${sanitizedRepo}(avatars).png` : `${sanitizedRepo}.jpg`;
        const jsDelivrUrl = `https://cdn.jsdelivr.net/gh/hemanth0525/contribuzz/public/walls/${fileName}`;

        console.log(`Redirecting to jsDelivr URL: ${jsDelivrUrl}`);

        // Check if the image exists on jsDelivr
        const response = await fetch(jsDelivrUrl, { method: 'HEAD' });
        if (response.ok) {
            return NextResponse.redirect(jsDelivrUrl);
        } else {
            console.log("Image not found on jsDelivr");
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
