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
      const { topic, count, provider, customRequirements } = input

      try {
        const languageModel = resolveLanguageModel(provider as AiProvider)

        // 定义可用的模型列表，确保每位专家使用不同的模型
        const availableModels = [
          'claude-sonnet-4-5-20250929',
          'gemini-2.5-pro',
          'DeepSeek-V3.2-Exp',
          'qwen3-max',
          'glm-4.6',
        ]

        // 构建用户自定义要求部分
        const customRequirementsSection = customRequirements
          ? `
## ⚠️ 用户特别要求（优先级最高！）

用户对专家组成有以下特别要求，**必须严格遵守**：

${customRequirements}

请确保生成的${count}位专家中，至少有部分专家符合以上要求。如果要求明确指定了某类专家，必须包含。

---
`
          : ''

        const prompt = `你是一个会议组织者。针对话题"${topic}"，请生成${count}位不同领域和层级的专家。
${customRequirementsSection}
## 核心要求：

### 1. 角色多样性与实践导向（重要！）
**必须包含实践者和不同层级的从业者**，而非全是学者/研究者。建议比例：
- **一线实践者（40%）**：工程师、产品经理、设计师、销售、运营、客服等，有丰富实战经验
- **管理层（30%）**：团队负责人、部门主管、创业者，关注执行和落地
- **战略层/顾问（20%）**：CTO、行业顾问、投资人，关注战略和趋势
- **学术/研究者（10%）**：仅少量学者，关注理论和前沿研究

**领域覆盖**（根据话题灵活调整）：
- **技术工程**：一线开发工程师、架构师、技术经理
- **产品商业**：产品经理、商业分析师、销售总监、市场营销
- **用户体验**：设计师、用户研究员、客户成功经理
- **运营管理**：运营专员、项目经理、创业者
- **行业专家**：垂直行业从业者（如医疗、教育、金融等）

### 2. 观点差异性与批判性
- 专家之间应有**不同甚至对立**的观点和立场
- **基层 vs 高层**：基层关注执行细节和实际困难，高层关注战略方向
- **乐观 vs 谨慎**：部分专家看到机遇，部分专家强调风险
- **理想 vs 现实**：部分专家追求完美方案，部分专家强调妥协和可行性
- **不同公司规模视角**：大厂经验 vs 创业公司经验，资源丰富 vs 资源受限

### 3. 思维方式互补性
- **数据驱动型**：依赖数据和指标做决策（temperature: 0.3-0.5）
- **经验驱动型**：基于实战经验和直觉判断（temperature: 0.6-0.8）
- **创新驱动型**：追求创新和突破（temperature: 0.8-1.0）

### 4. 专业深度要求
每位专家的 systemPrompt 必须包含：
- **职业背景**：具体的工作经历、项目经验、所在行业和公司规模（例如：某互联网大厂 5 年经验，某创业公司 CTO）
- **实战案例**：经历过的成功/失败案例，踩过的坑，实际解决的问题
- **核心观点**：基于实践经验形成的核心立场（而非纯理论）
- **思维特点**：如何分析问题、做决策、权衡取舍
- **批判倾向**：倾向于质疑什么（如：过度理想化、忽视执行成本、脱离实际等）

## 输出格式：

请以JSON数组格式返回，每个专家包含以下字段：
- **name**: 专家姓名（真实感、接地气）
- **role**: 专家角色/职位（具体明确，例如："某电商平台高级产品经理"、"某创业公司技术负责人"、"某SaaS公司销售总监"）
- **systemPrompt**: 该专家的系统提示词（400-600字，详细描述其职业背景、实战案例、核心观点、思维特点、批判倾向）
- **temperature**: 0.3-1.0之间的数值，精确反映该专家的思维风格
- **model**: 从以下列表中**随机选择一个不重复**的模型：${availableModels.join(', ')}

## 示例专家设定：

\`\`\`json
{
  "name": "李明",
  "role": "某互联网大厂资深后端工程师",
  "systemPrompt": "你是李明，在某互联网大厂担任资深后端工程师，有 8 年一线开发经验。你经历过多个大型项目从 0 到 1 的开发，也处理过系统从百万级用户到千万级用户的扩容。你的核心观点是：技术选型必须考虑团队能力和维护成本，过度追求新技术往往适得其反。你踩过的最大的坑是：曾经引入了一个很酷的微服务架构，结果因为团队经验不足，反而增加了系统复杂度和故障率。你的思维特点是：务实、关注可维护性，习惯用数据说话（监控指标、性能测试）。你倾向于批判那些只谈理论不谈落地的方案，强调'能跑起来'比'架构完美'更重要。在讨论中，你会分享具体的技术细节和踩坑经验。",
  "temperature": 0.5,
  "model": "claude-sonnet-4-5-20250929"
}
\`\`\`

**只返回JSON数组，不要任何解释或前缀。确保${count}位专家的模型各不相同，并且角色接地气、实践导向。**`

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

        // 为每个专家添加默认配置并确保模型不重复
        const usedModels = new Set<string>()
        const expertsWithDefaults = experts.map((expert, index) => {
          // 如果模型已被使用或不在可用列表中，随机分配一个未使用的模型
          let assignedModel = expert.model
          if (
            !assignedModel ||
            usedModels.has(assignedModel) ||
            !availableModels.includes(assignedModel)
          ) {
            const unusedModels = availableModels.filter(
              (m) => !usedModels.has(m),
            )
            assignedModel =
              unusedModels[index % unusedModels.length] ||
              availableModels[index % availableModels.length]
          }
          usedModels.add(assignedModel)

          return {
            ...expert,
            model: assignedModel,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${expert.name}`,
            provider: provider as 'openai' | 'claude' | 'gemini',
            temperature: expert.temperature || 0.7,
          }
        })

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

        // 构建上下文 - 包含所有历史讨论
        const contextMessages = discussionHistory
          .map(
            (msg: Message, index: number) =>
              `[发言 ${index + 1}] ${msg.expertName}（${discussionHistory.find((m) => m.expertName === msg.expertName) ? '专家' : ''}）:\n${msg.content}`,
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
- **具体而非抽象**：用具体案例、数据、实战经验支撑观点, 不编造数据, 而是使用众所周知的例子或者可考究的数据来源, 并且给出链接.
- **真实准确的证据**: 你的证据必须是真实准确的, 如果你不确定, 请不要使用.
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
