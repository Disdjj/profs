import { z } from 'zod'

// 专家配置
export const expertConfigSchema = z.object({
  name: z.string().min(1, '专家名称不能为空'),
  role: z.string().min(1, '专家角色不能为空'),
  avatar: z.string().optional(),
  systemPrompt: z.string().min(1, '系统提示不能为空'),
  provider: z.enum(['openai', 'claude', 'gemini']).default('openai'),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
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