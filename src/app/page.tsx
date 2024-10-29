'use client'

import Hero from '@/components/Hero'
import Sidebar from '@/components/Sidebar'
import HowItWorks from '@/components/HowItWorks'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow">
          <Hero />
          <HowItWorks />
        </main>
      </div>
    </div>
  )
}
