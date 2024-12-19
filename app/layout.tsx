import type { Metadata } from 'next'
import './globals.css'
import Navigation from './components/Navigation'
import { ThemeProvider } from './context/ThemeContext'
import ThemeSwitcher from './components/ThemeSwitcher'

export const metadata: Metadata = {
  title: 'Number Game',
  description: 'Modern number betting game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <ThemeProvider>
          <div className="max-w-7xl mx-auto bg-gaming-dark/30 min-h-screen relative pb-20">
            <div className="lg:max-w-3xl xl:max-w-4xl mx-auto">
              <div className="relative">
                <ThemeSwitcher />
              </div>
              {children}
            </div>
            <Navigation />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}