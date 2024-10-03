import '~/styles/globals.css'

import { GeistSans } from 'geist/font/sans'
import { type Metadata } from 'next'

import { ThemeProvider } from '~/app/_components/theme-provider'
import { TRPCReactProvider } from '~/trpc/react'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'MindTab',
  description: 'MindTab',
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} `}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <TRPCReactProvider>
            {children}
            <Analytics />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
