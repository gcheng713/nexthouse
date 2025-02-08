import "./globals.css"
import { Poppins } from "next/font/google"
import Header from "./components/Header"
import { ThemeProvider } from "./components/ThemeProvider"
import FormsButton from './components/FormsButton'
import type React from "react"

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
})

export const metadata = {
  title: "NextHouse - Future of Real Estate",
  description: "Revolutionizing real estate with cutting-edge technology",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
          <FormsButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
