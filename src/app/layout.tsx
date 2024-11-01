// RootLayout.tsx
import './globals.css'
import Inter from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'
import PullToRefresh from '@/components/PullToRefresh'
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars'
import 'overlayscrollbars/overlayscrollbars.css'

// Activate the OverlayScrollbars plugin
OverlayScrollbars.plugin(ClickScrollPlugin)

// Define the Inter font
const inter = Inter({
  src: './fonts/Inter-VariableFont_opsz,wght.ttf',
  variable: '--font-inter',
})

export const metadata = {
  title: 'Contri.buzz - Celebrate Your Open Source Contributors',
  description: "Showcase an interactive, real-time contributors' wall in your GitHub README.md",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <PullToRefresh>
          <div className="scroll-container">
            {children}
            <Analytics />
          </div>
        </PullToRefresh>
      </body>
    </html>
  )
}
