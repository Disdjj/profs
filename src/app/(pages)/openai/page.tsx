import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OpenAIChatDemo } from '@/components/chat/OpenAIChatDemo'

export const metadata: Metadata = {
  title: 'OpenAI 演示 | Fast MVP',
  description:
    '使用 Vercel AI SDK 调用 OpenAI 模型的入门示例，展示如何在 Fast MVP 模板中快速集成 AI 能力。',
}

export default function OpenAIPage() {
  return (
    <div className='mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-12 px-6 py-16'>
      <section className='space-y-6 text-center'>
        <div className='inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary'>
          OpenAI 集成演示
        </div>
        <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
          在 Fast MVP 中体验 OpenAI 聊天能力
        </h1>
        <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
          下方的演示组件通过 Vercel AI SDK 调用你在环境变量中配置的 OpenAI
          模型，展示了如何在几行代码内构建 AI 交互体验。
        </p>
      </section>

      <div className='flex justify-center'>
        <OpenAIChatDemo />
      </div>

      <Card className='border-dashed'>
        <CardContent className='flex flex-col gap-4 p-6 text-left text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='font-medium text-foreground'>快速上手</p>
            <p>
              在 <code>.env.local</code> 中设置 <code>OPENAI_API_KEY</code>{' '}
              （及可选的 <code>OPENAI_MODEL</code>），然后重启开发服务器。
            </p>
          </div>
          <Button asChild variant='outline'>
            <Link href='/'>返回首页</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
