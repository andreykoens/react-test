import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'React Test',
  description: 'Technical test of recent code practices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
