import type { Metadata } from 'next'
import './globals.css'
import { TRPCProvider } from '@/components/providers/TrpcProvider'

export const metadata: Metadata = {
  title: {
    default: 'Fast MVP - AI 应用快速开发模板',
    template: '%s | Fast MVP',
  },
  description:
    '基于 Next.js 15、tRPC 和多 AI Provider 的全栈应用模板，支持 OpenAI、Claude 和 Gemini',
  keywords: ['Next.js', 'tRPC', 'AI', 'OpenAI', 'Claude', 'Gemini', 'MVP'],
  authors: [{ name: 'Fast MVP Team' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'Fast MVP',
    title: 'Fast MVP - AI 应用快速开发模板',
    description: '快速构建 AI 驱动的全栈应用',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className='font-sans antialiased'>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  )
}
