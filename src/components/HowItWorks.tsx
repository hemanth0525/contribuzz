'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { Github, Zap, Share2 } from 'lucide-react'

const InnerCard = styled.div`
    background-color: #161b22;
    z-index: 2;
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: #c9d1d9;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    position: relative;
    border-radius: 12px;
    padding: 24px;
`

interface OuterCardProps {
    cursory: string;
    cursorx: string;
    opacity: number;
}

const OuterCard = styled.div<OuterCardProps>`
    --cursor-y: ${(props) => props.cursory};
    --cursor-x: ${(props) => props.cursorx};
    --glow-opacity: ${(props) => props.opacity};
    width: 400px;
    height: 100%;
    position: relative;
    padding: 1px;
    border-radius: 12px;
    background-image: linear-gradient(
        135deg,
        rgba(88, 166, 255, 0.2),
        rgba(59, 130, 246, 0.1)
    );
    cursor: pointer;
    &:before {
        background-image: radial-gradient(
        350px at var(--cursor-x) var(--cursor-y),
        rgba(88, 166, 255, 0.6),
        transparent 60%
        );
        border-radius: 12px;
        background-origin: padding-box;
        content: "";
        position: absolute;
        inset: 0px;
        z-index: 1;
        opacity: var(--glow-opacity);
        transition: opacity 0.3s ease-out;
    }
`

const IconWrapper = styled.div`
    font-size: 48px;
    margin-bottom: 16px;
    color: #58a6ff;
`

const HowItWorks = () => {
    const steps = [
        {
            title: "Connect Your Repository",
            description: "Effortlessly link your GitHub repository and let our system work its magic. We'll analyze your project's contributors to build a massive stunning Contributors' Wall.",
            icon: <Github size={48} />
        },
        {
            title: "Create a Stunning Wall",
            description: "Watch as we generate a visually captivating wall that showcases each contributor's impact. Highlight their contributions and foster a vibrant community.",
            icon: <Zap size={48} />
        },
        {
            title: "Celebrate and Share",
            description: "Embed the wall in your README or website. Inspire your team and attract new contributors by celebrating your community's achievements and hard work.",
            icon: <Share2 size={48} />
        }
    ]

    return (
        <section id='how-it-works' className="pb-10 bg-[#0d1117] justify-center items-center">
            <div className="container justity-center items-center mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[#58a6ff] to-[#3b82f6]">
                    How It Works
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <GlowingCard key={index} index={index} step={step} />
                    ))}
                </div>
            </div>
        </section>
    )
}

const GlowingCard = ({ index, step }: { index: number; step: { title: string; description: string; icon: React.ReactNode } }) => {
    const [showGradient, setShowGradient] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const containerRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            setMousePosition({ x, y })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setShowGradient(true)}
            onMouseLeave={() => setShowGradient(false)}
            className="h-full min-h-[400px] p-4"
        >
            <OuterCard
                cursory={`${mousePosition.y}px`}
                cursorx={`${mousePosition.x}px`}
                opacity={showGradient ? 1 : 0}
            >
                <InnerCard>
                    <IconWrapper>{step.icon}</IconWrapper>
                    <div>
                        <h3 className="text-2xl font-semibold mb-4 text-[#c9d1d9]">{step.title}</h3>
                        <p className="text-[#8b949e] text-lg">{step.description}</p>
                    </div>
                    <div className="text-3xl font-bold mt-6 bg-clip-text text-transparent bg-gradient-to-br from-[#58a6ff] to-[#3b82f6]">
                        Step {index + 1}
                    </div>
                </InnerCard>
            </OuterCard>
        </motion.div>
    )
}

export default HowItWorks