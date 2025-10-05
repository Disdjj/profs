import { z } from 'zod'

// 专家配置
export const expertConfigSchema = z.object({
  name: z.string().min(1, '专家名称不能为空'),
  role: z.string().min(1, '专家角色不能为空'),
  avatar: z.string().optional(),
  systemPrompt: z.string().min(1, '系统提示不能为空'),
  provider: z.enum(['openai', 'claude', 'gemini']).default('openai'),
  model: z.string().optional(),
  temperature: z.number().min(0.3).max(1.0).default(0.7),
})

export type ExpertConfig = z.infer<typeof expertConfigSchema>

// 消息类型
export const messageSchema = z.object({
  id: z.string(),
  expertName: z.string(),
  content: z.string(),
  timestamp: z.number(),
})

export type Message = z.infer<typeof messageSchema>

// 专家讨论输入schema
export const expertDiscussionSchema = {
  // 生成专家
  generateExperts: z.object({
    topic: z.string().min(1, '话题不能为空'),
    count: z.number().min(2).max(10).default(5),
    provider: z.enum(['openai', 'claude', 'gemini']).default('openai'),
    customRequirements: z
      .string()
      .optional()
      .describe(
        '用户自定义的专家要求，例如：需要一位电商行业的产品经理、要有创业公司背景的工程师等',
      ),
  }),

  // 专家发言
  expertSpeak: z.object({
    expertConfig: expertConfigSchema,
    discussionHistory: z.array(messageSchema).default([]),
    topic: z.string().min(1, '话题不能为空'),
  }),

  // 仲裁者判断
  moderatorJudge: z.object({
    topic: z.string().min(1, '话题不能为空'),
    discussionHistory: z.array(messageSchema),
    provider: z.enum(['openai', 'claude', 'gemini']).default('openai'),
  }),

  // 生成白皮书
  generateWhitepaper: z.object({
    topic: z.string().min(1, '话题不能为空'),
    discussionHistory: z.array(messageSchema),
    provider: z.enum(['openai', 'claude', 'gemini']).default('openai'),
  }),
}
