import type { AiProvider } from '@/lib/ai/providers'
import { resolveLanguageModel } from '@/lib/ai/providers'
import type { ExpertConfig, Message } from '@/lib/schema/expert'
import { expertDiscussionSchema } from '@/lib/schema/expert'
import { TRPCError } from '@trpc/server'
import { generateText } from 'ai'
import { publicProcedure, router } from '../trpc'

export const expertRouter = router({
  // 生成专家
  generateExperts: publicProcedure
    .input(expertDiscussionSchema.generateExperts)
    .mutation(async ({ input }) => {
      const { topic, count, provider } = input

      try {
        const languageModel = resolveLanguageModel(provider as AiProvider)

        const prompt = `你是一个会议组织者。针对话题"${topic}"，请生成${count}位不同领域的专家。

要求：
1. 每位专家都应该有独特的专业背景和视角
2. 专家之间应该有不同的观点，能够产生有价值的讨论
3. 包含多个学科领域（技术、商业、社会、伦理等）

请以JSON数组格式返回，每个专家包含以下字段：
- name: 专家姓名
- role: 专家角色/职位（例如：AI伦理学家、技术架构师等）
- systemPrompt: 该专家的系统提示词（详细描述其专业背景、观点倾向、思考方式）
- temperature: 0.3-1.5之间的数值，反映该专家的思维风格（理性vs创造性）
- model: 推荐使用的模型名称（例如：gpt-4o, claude-3-5-sonnet-20241022, gemini-2.0-flash-exp等）

只返回JSON数组，不要其他内容。`

        const result = await generateText({
          model: languageModel,
          prompt,
          temperature: 0.8,
        })

        // 解析返回的JSON
        const jsonMatch = result.text.match(/\[[\s\S]*\]/)
        if (!jsonMatch) {
          throw new Error('无法解析专家列表')
        }

        const experts = JSON.parse(jsonMatch[0]) as ExpertConfig[]

        // 为每个专家添加默认配置
        const expertsWithDefaults = experts.map((expert, index) => ({
          ...expert,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${expert.name}`,
          provider: provider as 'openai' | 'claude' | 'gemini',
          temperature: expert.temperature || 0.7,
        }))

        return {
          success: true,
          experts: expertsWithDefaults,
        }
      } catch (error) {
        console.error('Generate experts failed:', error)

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error
              ? `生成专家失败: ${error.message}`
              : '生成专家时发生未知错误',
          cause: error,
        })
      }
    }),

  // 专家发言
  expertSpeak: publicProcedure
    .input(expertDiscussionSchema.expertSpeak)
    .mutation(async ({ input }) => {
      const { expertConfig, discussionHistory, topic } = input

      try {
        const languageModel = resolveLanguageModel(
          expertConfig.provider as AiProvider,
          expertConfig.model,
        )

        // 构建上下文
        const contextMessages = discussionHistory
          .map((msg: Message) => `${msg.expertName}: ${msg.content}`)
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

        const result = await generateText({
          model: languageModel,
          prompt,
          temperature: expertConfig.temperature,
        })

        return {
          success: true,
          message: result.text.trim(),
          usage: result.usage,
        }
      } catch (error) {
        console.error('Expert speak failed:', error)

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error
              ? `专家发言失败: ${error.message}`
              : '专家发言时发生未知错误',
          cause: error,
        })
      }
    }),

  // 仲裁者判断是否继续讨论
  moderatorJudge: publicProcedure
    .input(expertDiscussionSchema.moderatorJudge)
    .mutation(async ({ input }) => {
      const { topic, discussionHistory, provider } = input

      try {
        const languageModel = resolveLanguageModel(provider as AiProvider)

        const contextMessages = discussionHistory
          .map((msg: Message) => `${msg.expertName}: ${msg.content}`)
          .join('\n\n')

        const prompt = `你是一个会议主持人。针对话题"${topic}"，请分析以下讨论内容：

${contextMessages}

请判断：
1. 讨论是否已经充分（观点是否多样，是否深入）
2. 是否还有重要角度没有被讨论
3. 是否需要继续讨论

以JSON格式返回：
{
  "shouldContinue": true/false,
  "reason": "判断理由",
  "suggestedNextTopic": "如果需要继续，建议下一个讨论角度"
}

只返回JSON，不要其他内容。`

        const result = await generateText({
          model: languageModel,
          prompt,
          temperature: 0.3,
        })

        const jsonMatch = result.text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          throw new Error('无法解析仲裁结果')
        }

        const judgment = JSON.parse(jsonMatch[0])

        return {
          success: true,
          ...judgment,
        }
      } catch (error) {
        console.error('Moderator judge failed:', error)

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error
              ? `仲裁判断失败: ${error.message}`
              : '仲裁判断时发生未知错误',
          cause: error,
        })
      }
    }),

  // 生成白皮书
  generateWhitepaper: publicProcedure
    .input(expertDiscussionSchema.generateWhitepaper)
    .mutation(async ({ input }) => {
      const { topic, discussionHistory, provider } = input

      try {
        const languageModel = resolveLanguageModel(provider as AiProvider)

        const contextMessages = discussionHistory
          .map((msg: Message) => `${msg.expertName}: ${msg.content}`)
          .join('\n\n')

        const prompt = `请基于以下专家讨论内容，生成一份专业的白皮书。

话题: ${topic}

讨论内容:
${contextMessages}

白皮书要求：
1. **必须使用标准Markdown格式**：
   - 一级标题用 #
   - 二级标题用 ##
   - 三级标题用 ###
   - 段落之间空一行
   - 列表使用 - 或 1.
   - 重点内容使用 **粗体**
   - 代码或专有名词使用 \`反引号\`

2. 内容结构：
   # 标题（简洁有力的主标题）

   ## 摘要
   200字内概括核心观点

   ## 背景分析
   详细说明话题背景和重要性

   ## 专家观点总结
   汇总各位专家的核心观点

   ## 深入分析
   多角度深入剖析问题

   ## 挑战与机遇
   分析潜在的挑战和机遇

   ## 建议与结论
   提出具体建议和总结性结论

3. 保持专业、客观、有深度

请直接返回完整的Markdown格式白皮书，不要有任何前缀或解释。`

        const result = await generateText({
          model: languageModel,
          prompt,
          temperature: 0.7,
        })

        return {
          success: true,
          whitepaper: result.text.trim(),
          usage: result.usage,
        }
      } catch (error) {
        console.error('Generate whitepaper failed:', error)

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error
              ? `生成白皮书失败: ${error.message}`
              : '生成白皮书时发生未知错误',
          cause: error,
        })
      }
    }),
})
