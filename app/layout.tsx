import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { DebugPanel } from "@/components/debug-panel"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Media Converter",
  description: "Convert your media files with ease",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            {children}
            <Toaster />
            <DebugPanel />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
