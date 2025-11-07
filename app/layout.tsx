import './globals.css'
import React from 'react'

export const metadata = {
  title: 'FLAM Dashboard',
  description: 'Performance-critical data visualization'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  )
}
