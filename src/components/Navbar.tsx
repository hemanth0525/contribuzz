'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { CheckCircleIcon, CircleAlert, CircleX, Heart, Menu, X } from 'lucide-react'

const Navbar = () => {
    const [isNotifyOpen, setIsNotifyOpen] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [email, setEmail] = useState('')
    const [feedback, setFeedback] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [isFeedFocused, setIsFeedFocused] = useState(false)
    const [toast, setToast] = useState<{ type: "success" | "warning" | "error"; message: string } | null>(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleNotifySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/addSubscriber', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok) {
                setToast({ type: 'success', message: data.message })
                setEmail('')
                setTimeout(() => setIsNotifyOpen(false), 3000)
            } else {
                setToast({ type: 'warning', message: data.message })
            }
        } catch (error) {
            console.error('Error adding subscriber:', error)
            setToast({ type: 'error', message: 'An error occurred. Please try again.' })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/sendFeedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, feedback }),
            })

            if (response.ok) {
                setToast({ type: 'success', message: 'Feedback sent successfully' })
                setEmail('')
                setFeedback('')
                setTimeout(() => setIsFeedbackOpen(false), 3000)
            } else {
                setToast({ type: 'error', message: 'Failed to send feedback' })
            }
        } catch (error) {
            console.error('Error sending feedback:', error)
            setToast({ type: 'error', message: 'An error occurred. Please try again.' })
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (toast) {
            setTimeout(() => setToast(null), 3000)
        }
    }, [toast])

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id)
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' })
        }
        setIsMobileMenuOpen(false)
    }

    return (
        <nav className="bg-cb-bg border-b border-cb-border py-4">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Image src="/icon.svg" alt="Contri.buzz Logo" width={40} height={40} />
                        </motion.div>
                        <span className="text-xl sm:text-2xl font-bold">
                            Contri<span className="text-[#58a6ff] group-hover:text-[#79c0ff] transition-colors duration-300">.buzz</span>
                        </span>
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
                            <Heart className="w-4 h-4 mr-1 text-[#db61a2]" />
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
                    <button
                        className="md:hidden text-cb-text hover:text-cb-primary focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden mt-4"
                        >
                            <div className="flex flex-col space-y-2 items-center">
                                <button onClick={() => scrollToSection('contributors-wall')} className="text-cb-text hover:text-cb-primary py-2 w-full text-center">
                                    Contributors&apos; Wall
                                </button>
                                <button onClick={() => scrollToSection('how-it-works')} className="text-cb-text hover:text-cb-primary py-2 w-full text-center">
                                    How It Works
                                </button>
                                <a
                                    href="https://github.com/sponsors/hemanth0525"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cb-text hover:text-cb-primary py-2 w-full text-center flex items-center justify-center"
                                >
                                    <Heart className="w-4 h-4 mr-2 text-[#db61a2]" />
                                    Sponsor
                                </a>
                                <button
                                    onClick={() => {
                                        setIsNotifyOpen(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="text-cb-text hover:text-cb-primary py-2 w-full text-center flex items-center justify-center"
                                >
                                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" data-view-component="true" className="mr-2" fill="none" stroke="#db61a2" strokeWidth="1.5">
                                        <rect x="1" y="3" width="14" height="10" rx="1" ry="1" />
                                        <path d="M1.5 4L8 9L14.5 4" />
                                    </svg>
                                    Notify Me
                                </button>
                                <button
                                    onClick={() => {
                                        setIsFeedbackOpen(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="text-cb-text hover:text-cb-primary py-2 w-full text-center flex items-center justify-center"
                                >
                                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" data-view-component="true" className="mr-2" fill="none" stroke="#db61a2" strokeWidth="1.5">
                                        <rect x="3" y="1" width="12" height="14" rx="1" ry="1" />
                                        <line x1="5" y1="4" x2="13" y2="4" />
                                        <line x1="5" y1="7" x2="13" y2="7" />
                                        <line x1="5" y1="10" x2="13" y2="10" />
                                    </svg>
                                    Feedback
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {(isNotifyOpen || isFeedbackOpen) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => {
                            setIsNotifyOpen(false);
                            setIsFeedbackOpen(false);
                            setIsFocused(false);
                            setIsFeedFocused(false);
                        }}
                    >
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="bg-cb-bg-light p-6 rounded-lg shadow-xl w-full max-w-md"
                            onClick={e => e.stopPropagation()}
                        >
                            {isNotifyOpen ? (
                                <>
                                    <h2 className="text-xl font-semibold mb-4 text-cb-text">Get Notified</h2>
                                    <p className="mb-4 text-cb-text-muted">
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
                                                className="flex-1 px-3 py-2 text-sm font-medium bg-[#238636] text-white rounded-md hover:bg-[#2ea043] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#238636] transition-colors duration-200"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Submitting...' : 'Notify Me'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsNotifyOpen(false);
                                                    setIsFocused(false);
                                                }}
                                                className="flex-1 px-3 py-2 text-sm font-medium bg-[#21262d] text-cb-text rounded-md hover:bg-[#30363d] focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-[#21262d] transition-colors duration-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <>
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
                                                className={`absolute left-3 transition-all cursor-text duration-200 ${isFocused || email ? '-top-2.5 text-xs bg-cb-bg-light px-1 text-cb-primary' : 'top-2 text-cb-text-muted'}`}
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
                                                className={`absolute left-3 transition-all cursor-text duration-200 ${isFeedFocused || feedback ? '-top-2.5 text-xs bg-cb-bg-light px-1 text-cb-primary' : 'top-2 text-cb-text-muted'}`}
                                            >
                                                Enter your feedback
                                            </label>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="flex-1 px-3 py-2 text-sm font-medium bg-[#238636] text-white rounded-md hover:bg-[#2ea043] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#238636] transition-colors duration-200"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsFeedbackOpen(false);
                                                    setIsFeedFocused(false);
                                                }}
                                                className="flex-1 px-3 py-2 text-sm font-medium bg-[#21262d] text-cb-text rounded-md hover:bg-[#30363d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#21262d] transition-colors duration-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
        </nav>
    )
}

export default Navbar