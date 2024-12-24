import './globals.css'
import Navigation from './components/Navigation'
import { ThemeProvider } from './context/ThemeContext'
import ThemeSwitcher from './components/ThemeSwitcher'
import { GameProvider } from './context/GameContext'
import ClientLayout from './components/ClientLayout'
import { metadata } from './metadata'
import BottomNavWrapper from './components/BottomNavWrapper'

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <ThemeProvider>
          <GameProvider>
            <ClientLayout>
              <div className="max-w-7xl mx-auto bg-gaming-dark/30 min-h-screen relative pb-20">
                <div className="lg:max-w-3xl xl:max-w-4xl mx-auto">
                  <div className="relative">
                    <ThemeSwitcher />
                  </div>
                  {children}
                </div>
                <Navigation />
                <BottomNavWrapper />
              </div>
            </ClientLayout>
          </GameProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}