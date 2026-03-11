import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WalletProvider } from '@/providers/WalletProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QFC AI Inference Marketplace',
  description: 'Decentralized AI inference marketplace on QFC blockchain',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-950`}>
        <WalletProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  )
}
