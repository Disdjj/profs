# 多专家讨论系统 (AI Experts Discussion System)

一个基于 AI 的多专家协作讨论平台，能够自动生成专家团队、进行深度讨论，并生成专业白皮书。

## ✨ 功能特性

- **🤖 智能专家生成**：根据话题自动创建 5 位不同领域的 AI 专家
- **💬 流式讨论输出**：实时观看专家发言，支持流式文本输出
- **⚙️ 灵活配置**：右键专家头像可自定义模型 ID 和温度参数
- **🤵 AI 主持人**：智能判断讨论是否应该继续
- **📄 白皮书生成**：一键将讨论内容总结为结构化 Markdown 文档
- **🎨 现代化 UI**：基于 shadcn/ui 和 MagicUI 的精美界面

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router) + TypeScript
- **API 层**: tRPC v11 (端到端类型安全)
- **AI 集成**: Vercel AI SDK + OpenAI
- **UI 组件**: shadcn/ui + Radix UI + MagicUI
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **数据库**: Drizzle ORM + SQLite
- **表单验证**: Zod
- **包管理**: pnpm

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd profs

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 OpenAI API Key
```

### 环境变量配置

在 `.env.local` 中配置以下变量：

```env
# OpenAI 配置（必需）
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
OPENAI_BASE_URL=https://api.openai.com/v1

# 数据库配置（可选）
DB_FILE_NAME=file:local.db
```

### 运行开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 生产构建

```bash
pnpm build
pnpm start
```

## 📖 使用方法

### 1. 输入讨论话题

在专家讨论页面输入你想深入探讨的问题或主题。

### 2. AI 生成专家团队

系统自动创建 5 位不同领域的专业 AI 专家，每位专家都有：
- 独特的角色定位
- 专业的系统提示词
- 推荐的 AI 模型配置

### 3. 专家自由讨论

- 点击侧边栏的专家头像让他们发言
- 支持流式输出，实时观看思考过程
- 右键专家头像可修改模型 ID 和温度参数

### 4. 生成专业白皮书

讨论结束后，点击"生成白皮书"按钮：
- 自动总结讨论内容
- 生成结构化的 Markdown 文档
- 支持实时预览渲染

## 📁 项目结构

```
src/
├── app/
│   ├── (pages)/              # 客户端页面
│   │   ├── experts/          # 专家讨论主页面
│   │   └── page.tsx          # 首页
│   └── (server)/
│       └── api/
│           ├── trpc/         # tRPC HTTP 端点
│           └── expert/       # 专家流式 API
│               └── stream/
├── components/
│   ├── ui/                   # shadcn/ui 基础组件
│   ├── magicui/              # MagicUI 动画组件
│   └── providers/            # React Context 提供者
├── server/
│   └── routers/              # tRPC 路由定义
│       ├── _app.ts           # 根路由
│       └── expert.ts         # 专家系统路由
├── lib/
│   ├── schema/               # Zod 验证模式
│   ├── ai/                   # AI 提供商配置
│   └── trpc/                 # tRPC 客户端配置
└── db/
    ├── schema/               # 数据库表结构
    └── db.ts                 # 数据库实例
```

## 🔧 常用命令

```bash
# 开发
pnpm dev              # 启动开发服务器 (Turbopack)
pnpm lint             # 运行 ESLint
pnpm format           # 格式化代码 (Prettier)

# 构建
pnpm build            # 生产构建
pnpm start            # 启动生产服务器

# 数据库
pnpm db:push          # 推送数据库模式（开发）
pnpm db:generate      # 生成迁移文件
pnpm db:migrate       # 运行迁移（生产）
pnpm db:studio        # 打开 Drizzle Studio
```

## 🎯 核心功能实现

### 专家生成

```typescript
// 根据话题自动生成 5 位专家
const result = await trpc.expert.generateExperts.mutate({
  topic: '量子计算的未来发展'
})
```

### 流式讨论

```typescript
// 专家发言，支持流式输出
const response = await fetch('/api/expert/stream', {
  method: 'POST',
  body: JSON.stringify({
    expertConfig,
    discussionHistory,
    currentTopic
  })
})
```

### 白皮书生成

```typescript
// 将讨论总结为 Markdown 白皮书
const whitepaper = await trpc.expert.generateWhitepaper.mutate({
  messages: discussionHistory,
  topic: currentTopic
})
```

## 🎨 主题系统

项目使用完整的主题系统（定义在 `src/app/(pages)/globals.css`）：

- **语义化颜色**: `primary`, `secondary`, `accent`, `muted`, `card`
- **预定义渐变**: `gradient-primary`, `gradient-warm`, `gradient-cool`
- **特效**: `shadow-warm`, `glow-primary`, `glow-accent`

推荐使用主题类而非硬编码颜色，以保持一致性和可维护性。

## 📝 添加新功能

遵循项目架构模式：

1. 在 `src/lib/schema/` 定义 Zod 模式
2. 在 `src/server/routers/` 创建 tRPC 路由
3. 在 `src/app/(pages)/` 创建页面组件
4. 使用 `trpc.*.useMutation()` 调用 API

详见 `CLAUDE.md` 中的开发指南。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT

---

**多专家讨论系统** - AI 驱动的深度分析与白皮书生成平台