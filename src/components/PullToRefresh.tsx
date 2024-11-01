// components/PullToRefresh.tsx
'use client'

import React from 'react'

interface PullToRefreshProps {
    children: React.ReactNode
}

export default function PullToRefresh({ children }: PullToRefreshProps) {
    const handleTouchStart = (e: React.TouchEvent) => {
        const startY = e.touches[0].pageY

        const handleTouchMove = (moveEvent: TouchEvent) => {
            const currentY = moveEvent.touches[0].pageY
            const distance = currentY - startY

            // Show refresh indicator if pulling down more than 50px
            if (window.scrollY === 0 && distance > 50) {
                document.getElementById('pull-to-refresh')?.classList.add('translate-y-0')
            }
        }

        const handleTouchEnd = () => {
            const pullToRefresh = document.getElementById('pull-to-refresh')
            if (pullToRefresh) {
                // Trigger a reload after pulling down and delay to simulate loading
                setTimeout(() => {
                    pullToRefresh.classList.remove('translate-y-0')
                    window.location.reload()
                }, 1000)
            }
            window.removeEventListener('touchmove', handleTouchMove)
            window.removeEventListener('touchend', handleTouchEnd)
        }

        window.addEventListener('touchmove', handleTouchMove)
        window.addEventListener('touchend', handleTouchEnd)
    }

    return (
        <div onTouchStart={handleTouchStart}>
            {/* Pull-to-refresh spinner */}
            <div
                id="pull-to-refresh"
                className="fixed top-0 left-0 right-0 -translate-y-full flex items-center justify-center h-12 bg-gradient-to-r from-blue-500 to-blue-700 text-white transition-transform duration-300 ease-in-out"
            >
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            </div>

            {/* Main content */}
            <main className="mt-12">{children}</main>
        </div>
    )
}
