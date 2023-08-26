import React from 'react'
import type { Metadata } from 'next'
import { ContextAuthProvider } from 'contexts/Auth'
import Script from 'next/script'
import { Header } from 'components/Header'

export const metadata: Metadata = {
  title: 'React Test',
  description: 'Technical test of recent code practices',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Script src="/fakerApi.js"></Script>
      <body>
        <ContextAuthProvider>
          {/*================== HEADER =================*/}
          <Header />
          {/*================== BODY =================*/}
          {children}
          {/*================== FOOTER =================*/}
          <footer>Written hastily by Andrey Koens, 2023 💖</footer>
        </ContextAuthProvider>
      </body>
    </html>
  )
}
