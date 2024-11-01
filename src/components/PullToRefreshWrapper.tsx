'use client';

import React, { useRef, useState, useEffect } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-react';

interface PullToRefreshWrapperProps {
    children: React.ReactNode;
    onRefresh: () => Promise<void>;
}

const GradientSpinner: React.FC = () => (
    <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#58a6ff] animate-spin"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-[#58a6ff] animate-spin-reverse"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#58a6ff] to-transparent opacity-30 animate-pulse"></div>
    </div>
);

const PullToRefreshWrapper: React.FC<PullToRefreshWrapperProps> = ({ children, onRefresh }) => {
    const osRef = useRef<OverlayScrollbarsComponentRef>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const touchStartY = useRef(0);
    const isMobile = useRef(false);

    useEffect(() => {
        isMobile.current = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        const osInstance = osRef.current?.osInstance();
        if (isMobile.current && osInstance && osInstance.elements().viewport.scrollTop === 0) {
            touchStartY.current = e.touches[0].clientY;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const osInstance = osRef.current?.osInstance();
        if (isMobile.current && osInstance && osInstance.elements().viewport.scrollTop === 0) {
            const touchY = e.touches[0].clientY;
            const pull = touchY - touchStartY.current;
            if (pull > 0) {
                e.preventDefault();
                setPullDistance(Math.min(pull, 100));
            }
        }
    };

    const handleTouchEnd = async () => {
        if (isMobile.current && pullDistance > 50 && !refreshing) {
            setRefreshing(true);
            await onRefresh();
            setRefreshing(false);
            setPullDistance(0);
        } else {
            setPullDistance(0);
        }
    };

    return (
        <OverlayScrollbarsComponent
            ref={osRef}
            options={{
                scrollbars: {
                    autoHide: 'leave',
                    theme: 'os-theme-light',
                },
            }}
            style={{ height: '100vh', overflow: 'hidden' }}
        >
            <div
                className="relative min-h-screen"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Pull-to-refresh indicator */}
                <div
                    className="absolute top-0 left-0 w-full flex flex-col justify-center items-center text-[#58a6ff] text-sm z-50 pointer-events-none"
                    style={{
                        height: `${pullDistance}px`,
                        opacity: pullDistance / 100,
                        transition: 'height 0.2s ease-out, opacity 0.2s ease-out'
                    }}
                >
                    {refreshing ? (
                        <>
                            <GradientSpinner />
                            <span className="mt-2">Refreshing...</span>
                        </>
                    ) : (
                        <span>{pullDistance > 50 ? 'Release to refresh' : 'Pull to refresh'}</span>
                    )}
                </div>
                {children}
            </div>
        </OverlayScrollbarsComponent>
    );
};

export default PullToRefreshWrapper;