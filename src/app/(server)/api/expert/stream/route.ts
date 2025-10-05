import { resolveLanguageModel } from '@/lib/ai/providers'
import type { AiProvider } from '@/lib/ai/providers'
import { streamText } from 'ai'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { expertConfig, discussionHistory, topic } = body

    // 构建上下文 - 包含所有历史讨论，格式化更清晰
    const contextMessages = discussionHistory
      .map(
        (msg: { expertName: string; content: string }, index: number) =>
          `[发言 ${index + 1}] ${msg.expertName}:\n${msg.content}`,
      )
      .join('\n\n---\n\n')

    const prompt = `${expertConfig.systemPrompt}

## 当前讨论会议

**主题**: ${topic}

**你的身份**: ${expertConfig.name}（${expertConfig.role}）

---

## 完整讨论历史

${contextMessages || '（你是第一位发言者，可以开启这个话题的讨论）'}

---

## 发言要求

### 1. 批判性思维（Critical Thinking）
- **如果你不同意**之前某位专家的观点，请**明确指出**并说明理由
- **质疑不合理的假设**：挑战可能存在的逻辑漏洞或未经验证的前提
- **提出反例**：如果你的专业经验中有反例，请分享
- **避免盲目认同**：即使观点相似，也要补充新的视角或证据

### 2. 建设性讨论（Constructive Engagement）
- **直接回应**：如果要回应某位专家，请明确提及对方（例如："关于李明教授提到的…"）
- **对话而非独白**：将讨论推向深入，而不是简单罗列观点
- **承认合理之处**：即使批判，也要承认对方观点中的合理成分
- **提供新价值**：不要重复已有观点，要么深化，要么提出新角度

### 3. 专业深度（Professional Depth）
- **具体而非抽象**：用具体案例、数据、实战经验支撑观点
- **展现专业特色**：体现你的职业背景和思维方式
- **分享真实经历**：提到具体的项目、数字、结果（成功或失败）
- **务实严谨**：承认不确定性，指出实际限制和权衡

### 4. 表达风格
- **长度控制**：300-500字（可以更充分地阐述观点和案例）
- **结构清晰**：观点明确，论证有力，有具体例子
- **语言个性化**：符合你的职业背景和工作场景，可以用行话/术语

---

## 发言格式

请直接给出你的发言内容，**不要添加"${expertConfig.name}："等前缀**。

如果要回应其他专家，可以使用类似格式：
- "我注意到[专家名]提到的[观点]，但从[你的领域]角度来看..."
- "关于[专家名]的[论点]，我有不同看法..."
- "补充[专家名]的观点，我认为还需要考虑..."

现在请发言：`

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
