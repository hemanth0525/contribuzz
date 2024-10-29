'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { CheckCircleIcon, CircleAlert, CircleX } from 'lucide-react'

const Navbar = () => {
    const [isNotifyOpen, setIsNotifyOpen] = useState(false)
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFocused, setIsFocused] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "warning" | "error"; message: string } | null>(null)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [isFeedFocused, setIsFeedFocused] = useState(false);

    const handleNotifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/addSubscriber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const responseText = await response.text();
            console.log('Response Text:', responseText); // Log response text

            // Attempt to parse the response as JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (error) {
                console.error('Failed to parse JSON:', error);
                setToast({ type: 'error', message: 'Failed to parse server response.' });
                return;
            }

            if (response.ok) {
                setToast({ type: 'success', message: data.message });
                setEmail('');
                setTimeout(() => {
                    setIsNotifyOpen(false);
                }, 3000);
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


    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/sendFeedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, feedback }),
            })
            if (response.ok) {
                // Show success message
                console.log('Feedback sent successfully')
            } else {
                // Show error message
                console.error('Failed to send feedback')
            }
        } catch (error) {
            console.error('Error sending feedback:', error)
        }
        setEmail('')
        setFeedback('')
        setIsFeedbackOpen(false)
    }

    useEffect(() => {
        if (toast) {
            setTimeout(() => setToast(null), 3000);
        }
    }, [toast]);

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <nav className="bg-cb-bg border-b border-cb-border py-4">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Image src="/icon.svg" alt="Contri.buzz Logo" width={40} height={40} />
                    <span className="text-xl font-semibold text-cb-text">Contri<span className="text-cb-primary">.buzz</span></span>
                </Link>
                <div className="hidden md:flex items-center space-x-4">
                    <button onClick={() => scrollToSection('contributors-wall')} className="text-cb-text hover:text-cb-primary">
                        Contributors&apos; Wall
                    </button>
                    <button onClick={() => scrollToSection('how-it-works')} className="text-cb-text hover:text-cb-primary">
                        How It Works
                    </button>
                    <a
                        href="https://github.com/sponsors/hemanth0525"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-sm border border-[#30363d] rounded-md bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#388bfd] transition-colors duration-200 flex items-center"
                    >
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className="mr-1 fill-[#db61a2]">
                            <path d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 0 0 8 13.393a20.561 20.561 0 0 0 3.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 0 1-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5ZM8 14.25l-.345.666-.002-.001-.006-.003-.018-.01a7.643 7.643 0 0 1-.31-.17 22.075 22.075 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.08 22.08 0 0 1-3.744 2.584l-.018.01-.006.003h-.002L8 14.25Z"></path>
                        </svg>
                        <span>Sponsor</span>
                    </a>
                    <button
                        onClick={() => setIsNotifyOpen(true)}
                        className="px-3 py-1 text-sm border border-[#30363d] rounded-md bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#388bfd] transition-colors duration-200 flex items-center"
                    >
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" data-view-component="true" className="mr-1" fill="none" stroke="#db61a2" strokeWidth="1.5">
                            <rect x="1" y="3" width="14" height="10" rx="1" ry="1" />
                            <path d="M1.5 4L8 9L14.5 4" />
                        </svg>
                        <span>Notify Me</span>
                    </button>
                    <button
                        onClick={() => setIsFeedbackOpen(true)}
                        className="px-3 py-1 text-sm border border-[#30363d] rounded-md bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#388bfd] transition-colors duration-200 flex items-center justify-center"
                    >
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" data-view-component="true" className="mr-1" fill="none" stroke="#db61a2" strokeWidth="1.5">
                            <rect x="3" y="1" width="12" height="14" rx="1" ry="1" />
                            <line x1="5" y1="4" x2="13" y2="4" />
                            <line x1="5" y1="7" x2="13" y2="7" />
                            <line x1="5" y1="10" x2="13" y2="10" />
                        </svg>
                        Feedback
                    </button>
                </div>
            </div>

            {isNotifyOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => {
                        setIsNotifyOpen(false)
                        setIsFocused(false)
                    }
                    }
                >
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className="bg-cb-bg-light p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold mb-4 text-cb-text">Get Notified</h2>
                        <p className="mb-4 text-cb-text-muted">
                            Support us in powering up our live server and real-time database to provide you with an interactive + real-time embeded script that integrates seamlessly across platforms.<br />
                            <br />
                            Be the first to know when we launch new features for our interactive contributors&apos; wall!
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
                                    className="flex-1 px-3 py-2 text-sm font-medium bg-[#238636] text-white rounded-md hover:bg-[#2ea043] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#238636]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Notify Me'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsNotifyOpen(false)
                                        setIsFocused(false)
                                    }}
                                    className="flex-1 px-3 py-2 text-sm font-medium bg-[#21262d] text-cb-text rounded-md hover:bg-[#30363d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#21262d]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                        {toast && (
                            <div className="toast toast-top toast-end px-4 py-2">
                                <div className={`mt-4 p-2 rounded-md text-white ${toast.type === 'success' ? 'alert alert-success' : toast.type === 'warning' ? 'alert alert-warning' : 'alert alert-error'}`}>
                                    {toast.type === 'success'
                                        ? <CheckCircleIcon className="w-6 h-6 mr-2" />
                                        : toast.type === 'warning' ?
                                            <CircleAlert className="w-6 h-6 mr-2" />
                                            : <CircleX className="w-6 h-6 mr-2" />
                                    }
                                    {toast.message}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
            {isFeedbackOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => {
                        setIsFeedbackOpen(false)
                        setIsFocused(false)
                        setIsFeedFocused(false)
                    }
                    }
                >
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className="bg-cb-bg-light p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold mb-4 text-cb-text">Send Your Valuable Feedback</h2>
                        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    id="feedback-email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    className="w-full px-3 py-2 bg-cb-bg-light border border-cb-border rounded-md text-cb-text focus:border-cb-primary transition-colors"
                                    required
                                />
                                <label
                                    htmlFor="feedback-email"
                                    className={`absolute left-3 transition-all cursor-text duration-200 ${isFocused || email ?
                                        '-top-2.5 text-xs bg-cb-bg-light px-1 text-cb-primary' : 'top-2 text-cb-text-muted'}`}
                                >
                                    Enter your email
                                </label>
                            </div>
                            <div className="relative">
                                <textarea
                                    id="feedback"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    onFocus={() => setIsFeedFocused(true)}
                                    onBlur={() => setIsFeedFocused(false)}
                                    className="w-full px-3 py-2 bg-cb-bg-light border border-cb-border rounded-md text-cb-text focus:border-cb-primary transition-colors"
                                    required
                                    rows={4}
                                />
                                <label
                                    htmlFor="feedback"
                                    className={`absolute left-3 transition-all cursor-text duration-200 ${isFeedFocused || feedback ?
                                        '-top-2.5 text-xs bg-cb-bg-light px-1 text-cb-primary' : 'top-2 text-cb-text-muted'}`}
                                >
                                    Enter your feedback
                                </label>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 px-3 py-2 text-sm font-medium bg-[#238636] text-white rounded-md hover:bg-[#2ea043] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#238636]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsFeedbackOpen(false)
                                        setIsFeedFocused(false)
                                    }}
                                    className="flex-1 px-3 py-2 text-sm font-medium bg-[#21262d] text-cb-text rounded-md hover:bg-[#30363d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#21262d]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </nav>
    )
}

export default Navbar