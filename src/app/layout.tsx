import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Contri.buzz - Celebrate Your Open Source Contributors',
  description: 'Showcase an interactive, real-time contributors\' wall in your GitHub README.md',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
          {children}
        <Footer />
      </body>
    </html>
  )
}
