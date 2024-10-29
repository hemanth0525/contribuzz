'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Users, X, Image as ImageIcon, Code, Copy, CopyCheck, CheckCircleIcon } from 'lucide-react'
import html2canvas from 'html2canvas-pro'
import sampleContributors from '../../public/sample.json'

type Contributor = {
    login: string
    avatar_url: string
    contributions: number
    html_url: string
    name: string | null
    bio: string | null
    location: string | null
}

type ContributorsWallProps = {
    initialRepo: string
}

const ContributorsWall: React.FC<ContributorsWallProps> = ({ initialRepo }) => {
    const [repo, setRepo] = useState(initialRepo)
    const [contributors, setContributors] = useState<Contributor[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isEmbedOpen, setIsEmbedOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('image')
    const [copied, setCopied] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [showNotifyToast, setShowNotifyToast] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [email, setEmail] = useState('')
    const wallRef = useRef<HTMLDivElement>(null)
    const [isWallSaved, setIsWallSaved] = useState(false)

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    useEffect(() => {
        if (isWallSaved) {
            setShowToast(true)
            setTimeout(() => setShowToast(false), 5000)
        }
    }, [isWallSaved])

    useEffect(() => {
        setRepo(initialRepo)
        setIsWallSaved(false)
        fetchContributors(initialRepo)
    }, [initialRepo])

    useEffect(() => {
        if (contributors.length > 0 && wallRef.current && repo) {
            generateWallImage(repo)
        }
    }, [contributors, repo, initialRepo])

    const generateWallImage = async (repoUrl: string) => {
        if (!wallRef.current) {
            console.error('wallRef is null')
            return
        }

        if (!repoUrl) {
            console.error('Repo URL is empty')
            return
        }


        console.log('Generating wall image...')
        try {
            const canvas = await html2canvas(wallRef.current, {
                backgroundColor: '#0d1117',
                scale: 2,
            })

            const textHeight = 51
            const newCanvas = document.createElement('canvas')
            newCanvas.width = canvas.width
            newCanvas.height = canvas.height + textHeight

            const ctx = newCanvas.getContext('2d')

            if (ctx) {
                ctx.fillStyle = '#0d1117'
                ctx.fillRect(0, 0, newCanvas.width, newCanvas.height)
                ctx.drawImage(canvas, 0, 0)

                ctx.font = '46px Arial'
                ctx.fillStyle = '#ffffff'
                ctx.textAlign = 'center'
                ctx.fillText('Made with ❤️ by Contri.Buzz', newCanvas.width / 2, (newCanvas.height - 8))

                const imageDataUrl = newCanvas.toDataURL('image/png')
                console.log('Image data URL generated')

                const sanitizedFileName = `${repoUrl.replace(/\//g, '-')}.png`
                console.log('Sanitized file name:', sanitizedFileName)

                const response = await fetch('/api/save-wall-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fileName: sanitizedFileName,
                        imageDataUrl: imageDataUrl,
                    }),
                })

                console.log('Response status:', response.status)
                console.log('Response body:', await response.text())

                if (!response.ok) {
                    throw new Error('Failed to save the wall image via API')
                }
                console.log('Wall saved successfully via API:')
                setIsWallSaved(true)
            } else {
                console.error('Failed to get 2D context')
                setError('Failed to generate or save the wall image. Please try again.')
            }
        } catch (error) {
            console.error('Error during image generation or save:', error)
            setError('Failed to generate or save the wall image. Please try again.')
        }
    }

    const fetchContributors = async (repoUrl: string) => {
    if (!repoUrl) {
        setContributors(sampleContributors.sampleContributors);
        return;
    }

    setIsLoading(true);
    setError(null);

    const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

    try {
        const [owner, repoName] = repoUrl.split('/');

        if (!owner || !repoName) {
            throw new Error("Invalid repository URL. Please use the format 'owner/repoName'.");
        }

        const res = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contributors?per_page=100`, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();

        const detailedContributors = await Promise.all(
            data.map(async (contributor: { login: string; url: string; contributions: number; html_url: string }) => {
                const userRes = await fetch(contributor.url, {
                    headers: {
                        'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    },
                });

                if (!userRes.ok) {
                    throw new Error(`HTTP error! status: ${userRes.status} - ${userRes.statusText}`);
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

        setContributors(detailedContributors);
    } catch (err) {
        console.error('Error fetching contributors:', err);
        setError('Failed to fetch contributors. Please check the repository URL and try again.');
    } finally {
        setIsLoading(false);
    }
};


    const embedImageCode = `<h1>Contributors' Wall</h1>
<a href="https://github.com/${repo}/graphs/contributors">
  <img src="https://contri.buzz/wallImage?repo=${repo}" alt="Contributors' Wall for ${repo}" />
</a>
Make your Contributors' Wall with <a href="https://contri.buzz/">Contri.Buzz</a>`

    const handleNotifySubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Notify email:', email)
        setEmail('')
        setShowNotifyToast(true)
        setTimeout(() => setShowNotifyToast(false), 5000)
    }

    return (
        <section id="contributors-wall" className="py-10 bg-[#0d1117]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-[#58a6ff] mb-4">Contributors&apos; Wall</h2>
                <p className="text-center text-[#8b949e] mb-12">
                    {repo ? (
                        <span className="text-[#b9bcc0]">for <strong>{repo}</strong></span>
                    ) : (
                        <span className="text-[#8b949e]">
                            <strong>Note:</strong> This is a sample wall generated for <strong>github/gitignore</strong> on <strong>27/10/2024</strong>. <br />
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
                        <div ref={wallRef} className="grid grid-cols-6 gap-3 mb-12">
                            {contributors.slice(0, 100).map((contributor) => (
                                <div key={contributor.login} className="flex flex-col items-center">
                                    <div className="avatar">
                                        <div className="w-[80px] h-[80px] rounded-full overflow-hidden border-2  border-[#58a6ff] p-0.5">
                                            <div className="w-full h-full rounded-full overflow-hidden">
                                                <Image
                                                    src={contributor.avatar_url}
                                                    alt={contributor.login}
                                                    width={80}
                                                    height={80}
                                                    className="object-cover rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-lg font-medium text-[#c9d1d9] text-center mt-1 break-words">
                                        {contributor.login}
                                        <span className="block text-base text-[#8b949e]">{contributor.contributions}+ contributions</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="text-center">
                            <button
                                onClick={!initialRepo ? () => scrollToSection('hero') : () => setIsEmbedOpen(true)}
                                className={`px-6 py-2 font-semibold rounded-md transition-colors inline-flex items-center gap-2 ${isWallSaved && initialRepo ? 'bg-[#238636] text-white hover:bg-[#2ea043]' : !isWallSaved && initialRepo ? 'bg-gray-500 text-gray-300 tooltip cursor-not-allowed' : 'bg-gray-500 tooltip tooltip-warning text-gray-300 cursor-not-allowed'}`}
                                data-tip={!initialRepo ? "Generate Your Wall First" : "Usually takes 10 - 20 seconds"}
                                disabled={!isWallSaved && initialRepo !== ''}
                            >
                                <Users className="w-5 h-5" />
                                {!isWallSaved && initialRepo ? 'Saving Wall...' : 'Embed / Integrate'}
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
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setIsEmbedOpen(false)}
                >
                    <div
                        className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-[#c9d1d9]">Embed Contributors&apos; Wall</h3>
                            <button onClick={() => setIsEmbedOpen(false)} className="text-[#8b949e] hover:text-[#c9d1d9]">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex mb-6 bg-[#0d1117] rounded-md p-1">
                            <button
                                className={`flex-1 py-2 px-4 rounded-md ${activeTab === 'image' ? 'bg-[#21262d] text-[#c9d1d9]' : 'text-[#8b949e]'}`}
                                onClick={() => setActiveTab('image')}
                            >
                                <ImageIcon className="w-4 h-4 inline-block mr-2" />
                                Wall Image
                            </button>
                            <button
                                className={`flex-1 py-2 px-4 rounded-md ${activeTab === 'interactive' ? 'bg-[#21262d] text-[#c9d1d9]' : 'text-[#8b949e]'}`}
                                onClick={() => setActiveTab('interactive')}
                            >
                                <Code className="w-4 h-4 inline-block mr-2" />
                                Interactive Real-time Wall
                            </button>
                        </div>
                        {activeTab === 'image' && (
                            <div>
                                <p className="mb-4 text-white">
                                    We highly recommend you to come here and generate the wall at least once a week.
                                    No need to change any of your previously used embeds anywhere; we will update on the same URL.
                                </p>
                                <div className="relative bg-[#0d1117] p-4 rounded-md mb-4 border border-[#30363d]">
                                    <code className="text-sm whitespace-pre-wrap text-[#c9d1d9]">{embedImageCode}</code>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(embedImageCode)
                                            setCopied(true)
                                            setTimeout(() => {
                                                setCopied(false)
                                            }, 2000)
                                        }}
                                        id="copy-button"
                                        className="absolute top-2 right-2 px-2 py-1 bg-[#21262d] text-[#c9d1d9] rounded-md hover:bg-[#30363d] transition-colors"
                                    >
                                        {copied ? (
                                            <CopyCheck width={20} height={20} className="transition-transform transform scale-125" />
                                        ) : (
                                            <Copy width={20} height={20} className="transition-transform transform scale-100" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                        {activeTab === 'interactive' && (

                            <div className="bg-cb-bg-light rounded-lg shadow-lg">
                                <p className="text-white mb-6 text-lg">
                                    We&apos;re working on bringing you a live, interactive wall of contributors. Sponsor Us to power up our live servers and realtime db to make it happen faster! <br /> <br />Be the first to know when it is ready!
                                </p>
                                <form onSubmit={handleNotifySubmit} className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={() => setIsFocused(false)}
                                            className="w-full px-4 py-3 bg-cb-bg-light bg-opacity-20 border-2 border-white border-opacity-50 rounded-full text-white focus:outline-none focus:border-opacity-100 transition-all duration-300"
                                            required
                                        />
                                        <label
                                            htmlFor="email"
                                            className={`absolute left-4 transition-all duration-300 ${isFocused || email
                                                ? '-top-2.5 px-1 left-6 text-sm text-cb-primary bg-cb-bg-light'
                                                : 'top-3 text-white text-opacity-70'
                                                }`}
                                        >
                                            Enter your email
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full px-6 py-3 bg-cb-secondary text-white font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                                    >
                                        Notify Me
                                    </button>
                                </form>
                                {showNotifyToast && (
                                    <div className="mt-4 p-4 bg-green-500 text-white rounded-lg flex items-center">
                                        <CheckCircleIcon className="w-6 h-6 mr-2" />
                                        <span>Thank you! We&apos;ll notify you when the interactive wall is live.</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}

export default ContributorsWall