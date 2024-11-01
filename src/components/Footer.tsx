'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Github, Mail } from 'lucide-react'
import { Icon } from '@iconify/react';

// Footer component
const Footer = () => {
    // Get the current year
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gradient-to-b from-[#0d1117] to-[#161b22] text-[#c9d1d9] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Logo and description */}
                <div className="space-y-4">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Image src="/icon.svg" alt="Contri.buzz Logo" width={40} height={40} />
                        </motion.div>
                        <span className="text-2xl font-bold">
                            Contri<span className="text-[#58a6ff] group-hover:text-[#79c0ff] transition-colors duration-300">.buzz</span>
                        </span>
                    </Link>
                    <p className="text-sm text-[#8b949e]">Celebrating Open Source Contributors</p>
                    <p className="text-sm text-[#8b949e]">&copy; {currentYear} Contri.buzz. All rights reserved.</p>
                </div>

                {/* Project links */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#58a6ff]">Project</h3>
                    <ul className="space-y-2">
                        <li>
                            <a href="https://github.com/hemanth0525/contribuzz" target="_blank" rel="noopener noreferrer" className="text-[#8b949e] hover:text-[#58a6ff] transition-colors duration-300">GitHub Repo</a>
                        </li>
                        <li>
                            <a href="https://github.com/hemanth0525/contribuzz/issues" target="_blank" rel="noopener noreferrer" className="text-[#8b949e] hover:text-[#58a6ff] transition-colors duration-300">Issues</a>
                        </li>
                        <li>
                            <a href="https://github.com/hemanth0525/contribuzz/pulls" target="_blank" rel="noopener noreferrer" className="text-[#8b949e] hover:text-[#58a6ff] transition-colors duration-300">Pull Requests</a>
                        </li>
                    </ul>
                </div>

                {/* Community links */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#58a6ff]">Community</h3>
                    <ul className="space-y-2">
                        <li>
                            <a href="https://github.com/hemanth0525" target="_blank" rel="noopener noreferrer" className="text-[#8b949e] hover:text-[#58a6ff] transition-colors duration-300">GitHub Profile</a>
                        </li>
                        <li>
                            <a href="https://github.com/sponsors/hemanth0525" target="_blank" rel="noopener noreferrer" className="text-[#8b949e] hover:text-[#58a6ff] transition-colors duration-300">Sponsor</a>
                        </li>
                        <li>
                            <a href="https://github.com/hemanth0525/contribuzz/blob/main/CODE_OF_CONDUCT.md" target="_blank" rel="noopener noreferrer" className="text-[#8b949e] hover:text-[#58a6ff] transition-colors duration-300">Code of Conduct</a>
                        </li>
                    </ul>
                </div>

                {/* Contact links */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#58a6ff]">Contact</h3>
                    <ul className="space-y-2">
                        <li>
                            <a href="mailto:mail@contri.buzz" className="text-[#8b949e] hover:text-[#58a6ff] transition-colors duration-300 flex items-center">
                                <Mail className="w-5 h-5 mr-2" />
                                mail@contri.buzz
                            </a>
                        </li>
                        <li>
                            <a href="https://t.me/Blu3Ph4ntom" target="_blank" rel="noopener noreferrer" className="text-[#8b949e] hover:text-[#58a6ff] transition-colors duration-300 flex items-center">
                                <Icon icon="lineicons:telegram" className='w-5 h-5 mr-2' />
                                Telegram
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/hemanth0525/contribuzz" target="_blank" rel="noopener noreferrer" className="text-[#8b949e] hover:text-[#58a6ff] transition-colors duration-300 flex items-center">
                                <Github className="w-5 h-5 mr-2" />
                                GitHub
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Footer bottom text */}
            <div className="mt-8 mb-2 md:mt-12 md:mb-0 pt-8 border-t border-[#30363d] text-center">
                <p className="text-sm text-[#8b949e]">
                    Made with ❤️ by the open-source community
                </p>
            </div>
        </footer>
    )
}

export default Footer