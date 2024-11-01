'use client';

import { useEffect, useRef, useState } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Inter from 'next/font/local';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Load the Inter font with specific settings
const inter = Inter({
  src: './fonts/Inter-VariableFont_opsz,wght.ttf',
  variable: '--font-inter',
});

// Function to generate random positions and animation properties
const generateDots = (count: number) => {
  return Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${5 + Math.random() * 5}s`,
  }));
};

// Home component serves as the main page of the application
export default function Home() {
  const [dots, setDots] = useState<{ left: string; top: string; animationDelay: string; animationDuration: string; }[]>([]); // Start with an empty array
  const osRef = useRef(null); // Reference for OverlayScrollbars

  useEffect(() => {
    setDots(generateDots(20)); // Generate dots on client mount
  }, []);

  return (
    <div lang="en" className={inter.variable}>
      <OverlayScrollbarsComponent
        ref={osRef}
        options={{
          scrollbars: {
            autoHide: 'leave', // Hide scrollbar on mouse leave
            theme: 'os-theme-light', // Use a light theme for the scrollbar
            // Custom scrollbar styles can be added here
          },
        }}
        style={{ height: '100vh'}} // Ensure the scrollbar covers the entire height
      >
        <div className="relative min-h-screen bg-[#0d1117] overflow-hidden">
          {/* Large upward trending graph background */}
          <div
            className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(88, 166, 255, 0.05) 0%,
                  transparent 50%
                ),
                radial-gradient(
                  circle at 50% 100%,
                  rgba(88, 166, 255, 0.1) 0%,
                  transparent 50%
                )
              `,
            }}
          >
            {/* Animated graph lines */}
            <svg
              className="absolute bottom-0 left-0 w-full h-[70vh] opacity-20"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M0,50 Q25,45 50,35 T100,20"
                stroke="#58a6ff"
                strokeWidth="0.5"
                fill="none"
                className="animate-pulse"
              />
              <path
                d="M0,60 Q25,55 50,45 T100,30"
                stroke="#58a6ff"
                strokeWidth="0.5"
                fill="none"
                className="animate-pulse [animation-delay:200ms]"
              />
              <path
                d="M0,70 Q25,65 50,55 T100,40"
                stroke="#58a6ff"
                strokeWidth="0.5"
                fill="none"
                className="animate-pulse [animation-delay:400ms]"
              />
            </svg>
          </div>

          {/* Large Octocat overlay */}
          <div className="fixed right-[-10vw] top-[20vh] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] opacity-[0.05] pointer-events-none">
            <svg
              viewBox="0 0 16 16"
              className="w-full h-full"
              fill="#58a6ff"
              aria-hidden="true"
            >
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
          </div>

          {/* Floating graph dots */}
          <div className="fixed inset-0 pointer-events-none">
            {dots.map((dot, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-[#58a6ff] rounded-full opacity-20 animate-float"
                style={{
                  left: dot.left,
                  top: dot.top,
                  animationDelay: dot.animationDelay,
                  animationDuration: dot.animationDuration,
                }}
              />
            ))}
          </div>

          <div className="flex flex-col min-h-screen">
            <div className="flex flex-grow">
              <main className="flex-grow">
                <Navbar />
                {/* Hero section */}
                <Hero />
                {/* How It Works section */}
                <HowItWorks />
                <Footer />
              </main>
            </div>
          </div>
        </div>
      </OverlayScrollbarsComponent>
    </div>
  );
}
