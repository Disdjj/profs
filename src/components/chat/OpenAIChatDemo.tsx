'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/utils'

const OPENAI_MODEL = 'gpt-4o-mini'

type Message = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * 为聊天气泡生成一个可读的角色标签。
 *
 * @param role 聊天消息的角色。
 */
const getRoleLabel = (role: string) => {
  switch (role) {
    case 'user':
      return '你'
    case 'assistant':
      return 'OpenAI'
    case 'system':
      return '系统'
    default:
      return role
  }
}

export const OpenAIChatDemo = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      // 添加助手回复到消息列表
      const assistantMessage: Message = {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: data.response,
      }
      setMessages((prev) => [...prev, assistantMessage])
    },
    onError: (error) => {
      console.error('发送消息失败:', error)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || sendMessageMutation.isPending) return

    const messageText = input.trim()

    // 添加用户消息到列表
    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      role: 'user',
      content: messageText,
    }

    // 先更新消息列表
    setMessages((prev) => [...prev, userMessage])

    // 发送消息到后端，使用当前的消息历史
    sendMessageMutation.mutate({
      message: messageText,
      provider: 'openai',
      model: OPENAI_MODEL,
      conversationHistory: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    // 清空输入框
    setInput('')
  }

  return (
    <Card className='w-full max-w-xl border border-border/60 bg-card/80 backdrop-blur'>
      <CardHeader>
        <CardTitle>OpenAI 聊天演示</CardTitle>
        <CardDescription>
          使用 Vercel AI SDK 调用 OpenAI 模型 {OPENAI_MODEL} 的最小示例。
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='rounded-lg border border-border/60 bg-background/60 p-4 h-72 overflow-y-auto space-y-3 text-sm'>
          {messages.length > 0 ? (
            messages.map((message) => (
              <div key={message.id} className='space-y-1'>
                <p className='text-muted-foreground font-medium'>
                  {getRoleLabel(message.role)}
                </p>
                <div
                  className={cn(
                    'rounded-md px-3 py-2 whitespace-pre-wrap leading-relaxed',
                    message.role === 'user'
                      ? 'bg-primary/10 text-primary-foreground/80 dark:text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground',
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))
          ) : (
            <div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
              输入问题后点击发送即可收到回复
            </div>
          )}
        </div>

        {sendMessageMutation.error ? (
          <div className='rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
            请求失败：{sendMessageMutation.error.message}
          </div>
        ) : null}

        <form
          className='flex flex-col gap-3 sm:flex-row'
          onSubmit={handleSubmit}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='例如：给我一个产品发布会的创意标题'
            className='flex-1'
            disabled={sendMessageMutation.isPending}
            autoFocus
          />
          <div className='flex gap-2'>
            <Button
              type='submit'
              disabled={
                sendMessageMutation.isPending || input.trim().length === 0
              }
            >
              {sendMessageMutation.isPending ? '生成中…' : '发送'}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className='text-xs text-muted-foreground flex flex-col gap-1 items-start'>
        <p>提示：你可以在 .env.local 中配置 OPENAI_MODEL 来覆盖默认模型。</p>
      </CardFooter>
    </Card>
  )
}
