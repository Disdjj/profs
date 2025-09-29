import { resolveLanguageModel } from '@/lib/ai/providers'
import type { AiProvider } from '@/lib/ai/providers'
import { streamText } from 'ai'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { expertConfig, discussionHistory, topic } = body

    // 构建上下文
    const contextMessages = discussionHistory
      .map((msg: { expertName: string; content: string }) =>
        `${msg.expertName}: ${msg.content}`
      )
      .join('\n\n')

    const prompt = `${expertConfig.systemPrompt}

讨论话题: ${topic}

之前的讨论内容:
${contextMessages || '（这是第一次发言）'}

请作为${expertConfig.name}（${expertConfig.role}）发表你的观点。要求：
1. 基于你的专业背景提供有见地的分析
2. 如果有之前的讨论，可以回应或补充其他专家的观点
3. 保持专业但不失个性
4. 控制在200字以内

请直接给出你的发言内容，不要添加"${expertConfig.name}："等前缀。`

    const languageModel = resolveLanguageModel(
      expertConfig.provider as AiProvider,
      expertConfig.model,
    )

    const result = await streamText({
      model: languageModel,
      prompt,
      temperature: expertConfig.temperature,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Stream expert speak failed:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : '流式生成失败',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}