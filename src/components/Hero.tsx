"use client";

import React, { useState } from "react";
import ContributorsWall from "./ContributorsWall";
import { X } from "lucide-react";

const Hero = () => {
    const [repo, setRepo] = useState("");
    const [submittedRepo, setSubmittedRepo] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN


        try {
            const [owner, repoName] = repo.split("/");
            const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`
                }
            })

            if (!response.ok) {
                // Logging the response for more detail
                const errorData = await response.json();
                console.error("Error Response Data:", errorData);

                if (response.status === 404) {
                    throw new Error(
                        "Repository not found or not public. Please check the URL and try again!"
                    );
                } else {
                    throw new Error(`Error ${response.status}: ${errorData.message}`);
                }
            }

            setSubmittedRepo(repo);
            setRepo("");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
            setShowErrorModal(true);
        }
    };


    return (
        <div id="hero" className="bg-[#0d1117] text-[#c9d1d9] py-20">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
                    Celebrate Your <span className="text-[#58a6ff]">Open Source</span>{" "}
                    Contributors
                </h1>
                <p className="text-xl mb-8 text-center text-[#8b949e]">
                    Create an interactive, real-time contributors&apos; wall for your
                    GitHub projects
                </p>
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                        <div className="relative flex w-full sm:w-auto">
                            <span className="inset-y-0 left-0 flex items-center pointer-events-none text-[#8b949e]">
                                https://github.com/
                            </span>
                            <input
                                type="text"
                                id="repo"
                                value={repo}
                                onChange={(e) => setRepo(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                required
                                className="w-auto ml-2 py-1 px-1 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff] transition-colors"
                            />
                            <label
                                htmlFor="repo"
                                className={`absolute left-36 transition-all cursor-text duration-200 ${isFocused || repo
                                    ? "-top-2.5 left-36 text-xs bg-[#0d1117] px-1 text-[#58a6ff]"
                                    : "top-1 text-[#8b949e]"
                                    }`}
                            >
                                user/repo
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-1 bg-[#238636] text-white font-semibold rounded-md hover:bg-[#2ea043] transition-colors"
                        >
                            Generate Wall
                        </button>
                    </div>
                </form>
            </div>
            <ContributorsWall initialRepo={submittedRepo} />

            {showErrorModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowErrorModal(false)}
                >
                    <div
                        className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#c9d1d9]">Error</h3>
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="text-[#8b949e] hover:text-[#c9d1d9]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-[#c9d1d9] mb-6">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hero;
