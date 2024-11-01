// RootLayout.tsx
import './globals.css'
import Inter from 'next/font/local'
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
  description: "Showcase a visually stunning contributors' wall in your GitHub README.md / App. Motivate your contributors by highlighting their valuable contributions to your open source projects, fostering community engagement and recognition. Join us in celebrating the unsung heroes of the open-source world and make your project shine!",
  keywords: 'Open Source, Contributors, GitHub, Recognition, Community Engagement, Developer Motivation, Contributors Wall, Open Source Contributions, Celebrate Contributors',
  author: 'Hemanth M',
  robots: 'index, follow',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Add the Google Analytics tracking ID
  const GA_TRACKING_ID = 'G-SVLY4BRHRQ';

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Google Tag (gtag.js) */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname });
            `,
          }}
        />
      </head>
      <body>
        <div className="scroll-container">
          {children}
        </div>
      </body>
    </html>
  )
}
