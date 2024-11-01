"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
    Users,
    X,
    Image as ImageIcon,
    Code,
    Copy,
    CopyCheck,
    CheckCircleIcon,
    CircleAlert,
    CircleX,
} from "lucide-react";
import sampleContributors from "../../public/sample.json";
import { AnimatePresence, motion } from "framer-motion";

type Contributor = {
    login: string;
    avatar_url: string;
    contributions: number;
    html_url: string;
    name: string | null;
    bio: string | null;
    location: string | null;
};

type ContributorsWallProps = {
    initialRepo: string;
};

/**
 * ContributorsWall component displays a wall of contributors for a given GitHub repository.
 * It fetches the contributors from the GitHub API, generates a visual representation of the contributors,
 * and provides options to embed the wall in other platforms.
 *
 * @component
 * @param {ContributorsWallProps} initialRepo - The initial repository URL in the format 'owner/repoName'.
 *
 * @example
 * <ContributorsWall initialRepo="facebook/react" />
 *
 * @remarks
 * This component uses the GitHub API to fetch contributors and generate a visual wall.
 * It supports embedding the wall in GitHub READMEs and other platforms.
 * The wall is optimized for GitHub Dark Default theme background.
 *
 * @returns {JSX.Element} The ContributorsWall component.
 */
const ContributorsWall: React.FC<ContributorsWallProps> = ({ initialRepo }) => {
    const [repo, setRepo] = useState(initialRepo);
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmbedOpen, setIsEmbedOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("image");
    const [copied, setCopied] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [email, setEmail] = useState("");
    const wallRef = useRef<HTMLDivElement>(null);
    const [isWallSaved, setIsWallSaved] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [toast, setToast] = useState<{ type: "success" | "warning" | "error"; message: string } | null>(null)


    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (toast) {
            setTimeout(() => setToast(null), 3000);
        }
    }, [toast]);

    useEffect(() => {
        if (isWallSaved) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);
        }
    }, [isWallSaved]);

    useEffect(() => {
        setRepo(initialRepo);
        setIsWallSaved(false);
        fetchContributors(initialRepo);
    }, [initialRepo]);

    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };


    const generateWallImage = useCallback(async (repoUrl: string) => {
        if (!repoUrl) {
            console.error('Repo URL is empty');
            return;
        }

        console.log('Generating wall images...');
        try {
            const fullWallCanvas = document.createElement('canvas');
            const fullWallCtx = fullWallCanvas.getContext('2d');

            const avatarWallCanvas = document.createElement('canvas');
            const avatarWallCtx = avatarWallCanvas.getContext('2d');

            if (!fullWallCtx || !avatarWallCtx) {
                throw new Error('Failed to get 2D context');
            }

            // Adjust scale factors to reduce image size
            const scale = 1.5; // Reduced from 2
            const avatarWallScale = 1.5; // Reduced from 2

            // Full wall configuration
            const avatarSize = 150 * scale;
            const horizontalGap = 40 * scale;
            const verticalGap = 60 * scale;
            const avatarsPerRow = 6;
            const nameFontSize = 30 * scale;
            const contributionFontSize = 28 * scale;
            const nameGap = 20 * scale;

            // Avatar wall configuration
            const avatarWallSize = 100 * avatarWallScale;
            const avatarWallGap = 20 * avatarWallScale;
            const avatarsPerAvatarWallRow = 8;

            // Calculate dimensions for full wall
            const contentWidth = (avatarSize * avatarsPerRow) + (horizontalGap * (avatarsPerRow - 1));
            const totalWidth = 1280 * scale;
            const sidePadding = (totalWidth - contentWidth) / 2;

            const contributorsCount = contributors.length;
            const rows = Math.ceil(contributorsCount / avatarsPerRow);

            const rowHeight = avatarSize + nameGap + nameFontSize + contributionFontSize;
            const totalHeight =
                60 * scale + // Top padding
                (rowHeight * rows) + // Content height
                (verticalGap * (rows - 1)) + // Gaps between rows
                70 * scale; // Bottom padding

            fullWallCanvas.width = totalWidth;
            fullWallCanvas.height = totalHeight;

            // Calculate dimensions for avatar wall
            const avatarWallRows = Math.ceil(contributorsCount / avatarsPerAvatarWallRow);
            const avatarWallWidth = avatarsPerAvatarWallRow * avatarWallSize + (avatarsPerAvatarWallRow - 1) * avatarWallGap + 2 * avatarWallGap;
            const avatarWallHeight = avatarWallRows * avatarWallSize + (avatarWallRows - 1) * avatarWallGap + 2 * avatarWallGap + 60 * scale;

            avatarWallCanvas.width = avatarWallWidth;
            avatarWallCanvas.height = avatarWallHeight;

            // Draw full wall
            fullWallCtx.fillStyle = '#0d1117';
            fullWallCtx.fillRect(0, 0, fullWallCanvas.width, fullWallCanvas.height);

            // Draw avatar wall (transparent background)
            avatarWallCtx.clearRect(0, 0, avatarWallCanvas.width, avatarWallCanvas.height);

            for (let i = 0; i < contributorsCount; i++) {
                const contributor = contributors[i];

                // Full wall drawing
                const fullWallRow = Math.floor(i / avatarsPerRow);
                const fullWallCol = i % avatarsPerRow;

                const fullWallX = sidePadding + (fullWallCol * (avatarSize + horizontalGap)) + (avatarSize / 2);
                const fullWallY = 60 * scale + (fullWallRow * (rowHeight + verticalGap));

                // Avatar wall drawing
                const avatarWallRow = Math.floor(i / avatarsPerAvatarWallRow);
                const avatarWallCol = i % avatarsPerAvatarWallRow;

                const avatarWallX = avatarWallGap + avatarWallCol * (avatarWallSize + avatarWallGap);
                const avatarWallY = avatarWallGap + avatarWallRow * (avatarWallSize + avatarWallGap);

                const img = await loadImage(contributor.avatar_url);

                // Draw on full wall
                fullWallCtx.save();
                fullWallCtx.beginPath();
                fullWallCtx.arc(fullWallX, fullWallY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
                fullWallCtx.closePath();
                fullWallCtx.clip();
                fullWallCtx.drawImage(img, fullWallX - avatarSize / 2, fullWallY, avatarSize, avatarSize);
                fullWallCtx.restore();

                fullWallCtx.beginPath();
                fullWallCtx.arc(fullWallX, fullWallY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
                fullWallCtx.lineWidth = 4 * scale;
                fullWallCtx.strokeStyle = '#58a6ff';
                fullWallCtx.stroke();

                fullWallCtx.font = `${nameFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`;
                fullWallCtx.fillStyle = '#ffffff';
                fullWallCtx.textAlign = 'center';
                fullWallCtx.textBaseline = 'top';
                const usernameLines = contributor.login.match(/.{1,10}/g) || [];
                usernameLines.forEach((line, index) => {
                    fullWallCtx.fillText(line, fullWallX, fullWallY + avatarSize + nameGap + (index * nameFontSize));
                });

                const contributionText = `${contributor.contributions}+`;
                fullWallCtx.font = `bold ${contributionFontSize * 0.6}px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`;
                fullWallCtx.fillStyle = '#b0b0b0';
                fullWallCtx.textAlign = 'left';
                fullWallCtx.textBaseline = 'top';
                const contributionX = fullWallX + avatarSize / 2 - 20 * scale;
                const contributionY = fullWallY;
                fullWallCtx.fillText(contributionText, contributionX, contributionY);

                // Draw on avatar wall
                avatarWallCtx.save();
                avatarWallCtx.beginPath();
                avatarWallCtx.arc(avatarWallX + avatarWallSize / 2, avatarWallY + avatarWallSize / 2, avatarWallSize / 2, 0, Math.PI * 2);
                avatarWallCtx.clip();
                avatarWallCtx.drawImage(img, avatarWallX, avatarWallY, avatarWallSize, avatarWallSize);
                avatarWallCtx.restore();

                avatarWallCtx.beginPath();
                avatarWallCtx.arc(avatarWallX + avatarWallSize / 2, avatarWallY + avatarWallSize / 2, avatarWallSize / 2, 0, Math.PI * 2);
                avatarWallCtx.lineWidth = 2 * avatarWallScale;
                avatarWallCtx.strokeStyle = '#58a6ff';
                avatarWallCtx.stroke();
            }

            // Add footer to full wall
            const footerY = totalHeight - 40 * scale;
            fullWallCtx.font = `${24 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`;
            fullWallCtx.fillStyle = '#ffffff';
            fullWallCtx.fillText('Made with ❤️ by Contri.Buzz', fullWallCanvas.width / 2 - 150 * scale, footerY);

            // Add footer to avatar wall
            const avatarWallFooterY = avatarWallHeight - 10 * avatarWallScale;
            avatarWallCtx.font = `${24 * avatarWallScale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`;
            avatarWallCtx.fillStyle = '#58a6ff';
            avatarWallCtx.textAlign = 'center';
            avatarWallCtx.fillText('Made with 💙 by Contri.Buzz', avatarWallCanvas.width / 2, avatarWallFooterY);

            // Function to compress image
            const compressImage = (canvas: HTMLCanvasElement, mimeType: string, maxSizeInBytes: number): string => {
                let quality = 1;
                let dataUrl = canvas.toDataURL(mimeType, quality);

                while (dataUrl.length > maxSizeInBytes && quality > 0.1) {
                    quality -= 0.1;
                    dataUrl = canvas.toDataURL(mimeType, quality);
                }

                if (dataUrl.length > maxSizeInBytes) {
                    // If still too large, resize the canvas
                    const scaleFactor = Math.sqrt(maxSizeInBytes / dataUrl.length);
                    const newWidth = canvas.width * scaleFactor;
                    const newHeight = canvas.height * scaleFactor;
                    const resizedCanvas = document.createElement('canvas');
                    resizedCanvas.width = newWidth;
                    resizedCanvas.height = newHeight;
                    const resizedCtx = resizedCanvas.getContext('2d');
                    if (resizedCtx) {
                        resizedCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
                        dataUrl = resizedCanvas.toDataURL(mimeType, 0.7); // Use a fixed quality after resizing
                    }
                }

                if (dataUrl.length > maxSizeInBytes) {
                    throw new Error(`Unable to compress image below ${maxSizeInBytes} bytes`);
                }

                return dataUrl;
            };

            // Compress images
            const maxSize = 4.5 * 1024 * 1024; // 4.5 MB
            const fullWallImageDataUrl = compressImage(fullWallCanvas, 'image/jpeg', maxSize);
            const avatarWallImageDataUrl = compressImage(avatarWallCanvas, 'image/png', maxSize);

            const sanitizedRepoName = repoUrl.replace(/\//g, '-').toLowerCase();
            const fullWallFileName = `${sanitizedRepoName}.jpg`;
            const avatarWallFileName = `${sanitizedRepoName}(avatars).png`;

            console.log('Saving wall images...');

            // Save full wall image
            const fullWallResponse = await fetch('/api/save-full-wall', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: fullWallFileName,
                    imageDataUrl: fullWallImageDataUrl,
                }),
            });

            if (!fullWallResponse.ok) {
                const responseData = await fullWallResponse.json();
                throw new Error(responseData.error || 'Failed to save the full wall image');
            }

            // Save avatar wall image
            const avatarWallResponse = await fetch('/api/save-avatar-wall', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: avatarWallFileName,
                    imageDataUrl: avatarWallImageDataUrl,
                }),
            });

            if (!avatarWallResponse.ok) {
                const responseData = await avatarWallResponse.json();
                throw new Error(responseData.error || 'Failed to save the avatar wall image');
            }

            const fullWallData = await fullWallResponse.json();
            const avatarWallData = await avatarWallResponse.json();

            console.log('Wall images saved successfully:', { fullWall: fullWallData.url, avatarWall: avatarWallData.url });
            setIsWallSaved(true);
        } catch (error) {
            console.error('Error during image generation or save:', error);
            setError(`Failed to generate or save the wall images: ${(error as Error).message}`);
        }
    }
        , [contributors]);

    useEffect(() => {
        if (contributors.length > 0 && wallRef.current && repo) {
            generateWallImage(repo);
        }
    }, [contributors, repo, initialRepo, generateWallImage]);

    const fetchContributors = async (repoUrl: string) => {
        if (!repoUrl) {
            setContributors(sampleContributors.sampleContributors);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/fetchContributors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoUrl }),
            });

            if (!res.ok) {
                throw new Error(
                    `HTTP error! status: ${res.status} - ${res.statusText}`
                );
            }

            const data = await res.json();
            setContributors(data);
        } catch (err) {
            console.error("Error fetching contributors:", err);
            setError("Failed to fetch contributors. Please check the repository URL and try again.");
        } finally {
            setIsLoading(false);
        }
    };


    const embedImageCode = `
<h1 align="center">Contributors' Wall</h1>

<a href="https://github.com/${repo}/graphs/contributors">
    <img src="https://contri.buzz/api/wall?repo=${repo}" alt="Contributors' Wall for ${repo}" />
</a>

<br />
<br />
    
<p align="center">
    Make your Contributors' Wall with <a href="https://contri.buzz/"><i>Contri.Buzz</i></a>
</p>
`

    const embedAvatarCode = `
<h1 align="center">Contributors' Wall</h1>

<a href="https://github.com/${repo}/graphs/contributors">
    <img src="https://contri.buzz/api/wall?repo=${repo}&onlyAvatars=true" alt="Contributors' Wall for ${repo}" />
</a>

<br />
<br />

<p align="center">
    Make your Contributors' Wall with <a href="https://contri.buzz/"><i>Contri.Buzz</i></a>
</p>
`

    const handleNotifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/addSubscriber', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setToast({ type: 'success', message: data.message });
                setEmail('');
                setTimeout(() => setIsEmbedOpen(false), 3000);
            } else {
                setToast({ type: 'warning', message: data.message });
            }
        } catch (error) {
            console.error('Error adding subscriber:', error);
            setToast({ type: 'error', message: 'An error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contributors-wall" className="pt-10 bg-[#0d1117]">
            <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#58a6ff] to-[#3b82f6]">
                Contributors&apos; Wall
            </h2>
            <p className="text-center text-[#8b949e] mb-8">
                {repo ? (
                <>
                    <span className="text-[#b9bcc0]">
                    for <strong>{repo}</strong>
                    </span>
                    <br />
                    <br />
                    <span className="text-center text-[#8b949e] italic">
                    <strong>Note:</strong> The actual wall you receive may differ slightly as it&apos;s optimized for GitHub <strong>README</strong> display.
                    </span>
                </>
                ) : (
                <span className="text-[#8b949e]">
                    <strong>Note:</strong> This is a sample wall generated for{" "}
                    <strong>github/gitignore</strong> on <strong>27/10/2024</strong>.{" "}
                    <br />
                    Input your repo above and generate your new wall!
                </span>
                )}
            </p>
            {isLoading && (
                <div className="flex justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#58a6ff]"></div>
                </div>
            )}
            {error && (
                <div className="bg-[#161b22] border-l-4 border-[#f85149] text-[#f85149] p-4 mb-8">
                <p className="font-bold">Error</p>
                <p>{error}</p>
                </div>
            )}
            {!isLoading && !error && (
                <>
                <div ref={wallRef} className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9 gap-4 mb-0.25">
                    {contributors.slice(0, 100).map((contributor) => (
                    <div key={contributor.login} className="flex flex-col items-center">
                        <div className="avatar">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#58a6ff] p-0.5">
                            <Image
                            src={contributor.avatar_url}
                            alt={contributor.login}
                            width={64}
                            height={64}
                            className="rounded-full"
                            />
                        </div>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-[#c9d1d9] text-center mt-2 break-words">
                        {contributor.login}
                        <span className="block text-xs text-[#8b949e]">
                            {contributor.contributions}+
                        </span>
                        </p>
                    </div>
                    ))}
                </div>
                <div className="text-center mt-4">
                    <button
                    onClick={
                        !initialRepo
                        ? () => scrollToSection("hero")
                        : () => { setIsEmbedOpen(true); setActiveTab('fullWall'); }
                    }
                    className={`px-6 py-2 font-semibold rounded-md transition-colors inline-flex items-center gap-2 ${isWallSaved && initialRepo
                        ? "bg-[#238636] text-white hover:bg-[#2ea043]"
                        : !isWallSaved && initialRepo
                        ? "bg-gray-500 text-gray-300 tooltip cursor-not-allowed"
                        : "bg-gray-500 tooltip tooltip-warning text-gray-300 cursor-not-allowed"
                        }`}
                    data-tip={
                        !initialRepo
                        ? "Generate Your Wall First"
                        : "Usually takes 10 - 20 seconds"
                    }
                    disabled={!isWallSaved && initialRepo !== ""}
                    >
                    <Users className="w-5 h-5" />
                    {!isWallSaved && initialRepo
                        ? "Saving Wall..."
                        : "Embed / Integrate"}
                    </button>
                    {showToast && (
                    <div className="toast toast-top toast-end px-4 py-2">
                        <div className="alert alert-success">
                        <div>
                            <CheckCircleIcon className="w-6 h-6 mr-2" />
                            <span>Wall saved successfully!</span>
                        </div>
                        </div>
                    </div>
                    )}
                </div>
                </>
            )}
            </div>

            {isEmbedOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsEmbedOpen(false)}>
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-[#c9d1d9]">Embed Contributors&apos; Wall</h3>
                    <button onClick={() => setIsEmbedOpen(false)} className="text-[#8b949e] hover:text-[#c9d1d9]">
                    <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex flex-wrap gap-4 mb-6">
                    <button
                    className={`flex-1 py-3 px-4 rounded-md transition-all ${activeTab === 'fullWall'
                        ? 'bg-[#238636] text-white shadow-lg transform scale-105'
                        : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
                        }`}
                    onClick={() => setActiveTab('fullWall')}
                    >
                    <ImageIcon className="w-5 h-5 inline-block mr-2" />
                    Full Wall
                    </button>
                    <button
                    className={`flex-1 py-3 px-4 rounded-md transition-all ${activeTab === 'avatarWall'
                        ? 'bg-[#238636] text-white shadow-lg transform scale-105'
                        : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
                        }`}
                    onClick={() => setActiveTab('avatarWall')}
                    >
                    <Users className="w-5 h-5 inline-block mr-2" />
                    Avatar Wall
                    </button>
                    <button
                    className={`flex-1 py-3 px-4 rounded-md transition-all ${activeTab === 'interactive'
                        ? 'bg-[#238636] text-white shadow-lg transform scale-105'
                        : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
                        }`}
                    onClick={() => setActiveTab('interactive')}
                    >
                    <Code className="w-5 h-5 inline-block mr-2" />
                    Interactive
                    </button>
                </div>
                {activeTab === 'fullWall' && (
                    <div>
                    <p className="mb-4 text-[#8b949e]">
                        We highly recommend revisiting and regenerating the wall at least once a week. No need to change the previously used embed code; we will update the same URL with the latest data!
                    </p>
                    <ul className="list-disc list-inside text-[#8b949e]">
                        <li>Usernames and contributions count</li>
                        <li>Profile pictures</li>
                        <li>Optimized for GitHub README display</li>
                        <li>GitHub Dark Default theme background</li>
                    </ul>
                    <div className="relative bg-[#0d1117] p-4 rounded-md mt-4 mb-4 border border-[#30363d]">
                        <code className="text-sm whitespace-pre-wrap text-[#c9d1d9]">
                        {embedImageCode}
                        </code>
                        <button
                        onClick={() => {
                            navigator.clipboard.writeText(embedImageCode)
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                        }}
                        className="absolute top-2 right-2 px-2 py-1 bg-[#21262d] text-[#c9d1d9] rounded-md hover:bg-[#30363d] transition-colors"
                        >
                        {copied ? <CopyCheck width={20} height={20} /> : <Copy width={20} height={20} />}
                        </button>
                    </div>
                    </div>
                )}
                {activeTab === 'avatarWall' && (
                    <div>
                    <p className="mb-4 text-[#8b949e]">
                        We highly recommend revisiting and regenerating the wall at least once a week. No need to change the previously used embed code; we will update the same URL with the latest data!
                    </p>
                    <ul className="list-disc list-inside text-[#8b949e]">
                        <li>Profile pictures</li>
                        <li>Optimized for GitHub README display</li>
                        <li>Transparent background</li>
                    </ul>
                    <div className="relative bg-[#0d1117] p-4 rounded-md mt-4 mb-4 border border-[#30363d]">
                        <code className="text-sm whitespace-pre-wrap text-[#c9d1d9]">
                        {embedAvatarCode}
                        </code>
                        <button
                        onClick={() => {
                            navigator.clipboard.writeText(embedAvatarCode)
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                        }}
                        className="absolute top-2 right-2 px-2 py-1 bg-[#21262d] text-[#c9d1d9] rounded-md hover:bg-[#30363d] transition-colors"
                        >
                        {copied ? <CopyCheck width={20} height={20} /> : <Copy width={20} height={20} />}
                        </button>
                    </div>
                    </div>
                )}
                {activeTab === 'interactive' && (
                    <div className="bg-[#0d1117] rounded-lg p-6 border border-[#30363d]">
                    <p className="text-[#8b949e] mb-6">
                        We&apos;re excited to announce that an interactive wall feature is in the works! This new feature will allow you to engage with contributors in real-time, explore their profiles, and celebrate their contributions in a dynamic and immersive way.
                    </p>
                    <p className="text-[#8b949e] mb-6">
                        Stay tuned for updates and be the first to experience this innovative addition to our platform. We appreciate your support and enthusiasm as we continue to enhance the Contributors&apos; Wall.
                    </p>
                    <p className="text-[#8b949e] mb-6">
                        We would love to hear your feedback and suggestions. Please consider sponsoring us to support ongoing development and improvements. Your contributions make a significant difference!
                    </p>
                    <p className="text-[#8b949e] mb-6">
                        Sign up to get notified about the latest updates and new features. Thank you for being a part of our community and helping us bring this vision to life!
                    </p>
                    <form onSubmit={handleNotifySubmit} className="flex flex-col gap-4 sm:flex-row items-center mt-4 w-full">
                        <div className="relative flex-grow">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="w-full px-3 py-2 bg-cb-bg-light border border-cb-border rounded-md text-cb-text focus:border-cb-primary transition-colors"
                            required
                        />
                        <label
                            htmlFor="email"
                            className={`absolute left-3 transition-all cursor-text duration-200 ${isFocused || email ? '-top-2.5 text-xs bg-cb-bg-light px-1 text-cb-primary' : 'top-2 text-cb-text-muted'}`}
                        >
                            Enter your email
                        </label>
                        </div>
                        <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex px-3 py-2 text-sm font-medium bg-[#238636] text-white rounded-md hover:bg-[#2ea043] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#238636]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Notify Me'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                            setIsFocused(false);
                            }}
                            className="flex-1 px-3 py-2 text-sm font-medium bg-[#21262d] text-cb-text rounded-md hover:bg-[#30363d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#21262d]"
                        >
                            Cancel
                        </button>
                        </div>
                    </form>
                    </div>
                )}
                </div>
            </div>
            )}
            <AnimatePresence>
            {toast && (
                <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-4 right-4 z-50"
                >
                <div className={`p-4 rounded-md shadow-lg ${toast.type === 'success' ? 'bg-green-500' :
                    toast.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    } text-white flex items-center`}>
                    {toast.type === 'success' ? <CheckCircleIcon className="w-6 h-6 mr-2" /> :
                    toast.type === 'warning' ? <CircleAlert className="w-6 h-6 mr-2" /> :
                        <CircleX className="w-6 h-6 mr-2" />}
                    <span>{toast.message}</span>
                </div>
                </motion.div>
            )}
            </AnimatePresence>
        </section>
    );
};

export default ContributorsWall;