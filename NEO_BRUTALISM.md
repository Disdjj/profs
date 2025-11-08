# Neo-Brutalism 设计系统文档

本项目已完成 Neo-Brutalism 设计系统的重构。以下是设计系统的详细说明和使用指南。

## 🎨 设计原则

Neo-Brutalism 是一种现代、高对比度、功能性强的设计风格，具有以下特征：

- **粗边框**：所有主要组件使用 3px 黑色实线边框
- **硬阴影**：无模糊的偏移阴影，创造物理层次感
- **大圆角**：柔和的大圆角（20px, 16px, 12px等）
- **高对比度**：深色文字配浅色背景
- **鲜艳重点色**：使用明亮的强调色（黄、粉、蓝、绿）

## 🎯 颜色系统

### 背景色
- `--bg-base`: #f5f5f3 - 页面基础背景
- `--bg-panel`: #fafaf8 - 面板/卡片背景
- `--bg-white`: #ffffff - 纯白元素（输入框、表格）
- `--bg-secondary`: #f0f0ee - 次要背景（表头）

### 文字颜色
- `--text-primary`: #000000 - 主要文字（纯黑）
- `--text-secondary`: #666666 - 次要文字（深灰）

### 重点色
- `--color-pink`: #ff7aa3 - 删除/危险操作
- `--color-yellow`: #ffd966 - 主要操作/警告/活动状态
- `--color-blue`: #6ba4ff - 信息/进行中状态
- `--color-green`: #5fe0a8 - 成功/完成状态

### 边框颜色
- `--border-primary`: #000000 - 黑色边框
- `--border-light`: #e0e0e0 - 浅灰边框（表格分隔线）

## 📦 组件使用指南

### Button 按钮

```tsx
import { Button } from '@/components/ui/button'

// 变体
<Button variant="default">默认按钮</Button>        // 黄色
<Button variant="destructive">删除</Button>         // 粉色
<Button variant="secondary">次要按钮</Button>       // 蓝色
<Button variant="success">成功</Button>             // 绿色
<Button variant="outline">轮廓按钮</Button>         // 白色带边框
<Button variant="ghost">幽灵按钮</Button>
<Button variant="link">链接按钮</Button>

// 尺寸
<Button size="sm">小按钮</Button>
<Button size="default">默认</Button>
<Button size="lg">大按钮</Button>
<Button size="icon">📌</Button>
```

**特性：**
- 3px 黑色边框
- 12px 圆角
- 4px 硬阴影
- 悬停时有按压效果（向右下移动 2px）

### Card 卡片

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
    <CardDescription>卡片描述</CardDescription>
  </CardHeader>
  <CardContent>
    <p>卡片内容</p>
  </CardContent>
  <CardFooter>
    <Button>操作</Button>
  </CardFooter>
</Card>
```

**特性：**
- 3px 黑色边框
- 20px 大圆角
- 6px 硬阴影
- 浅米色背景 (#fafaf8)

### Badge 徽章

```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="default">默认</Badge>
<Badge variant="secondary">次要</Badge>
<Badge variant="success">成功</Badge>
<Badge variant="destructive">危险</Badge>
<Badge variant="outline">轮廓</Badge>

// 任务状态专用
<Badge variant="inProgress">进行中</Badge>      // 蓝色
<Badge variant="completed">已完成</Badge>       // 绿色
<Badge variant="queued">队列中</Badge>          // 白色带边框
```

**特性：**
- 8px 小圆角
- 黑色文字
- 无边框（outline 变体除外）

### Input 输入框

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<div className="space-y-2">
  <Label htmlFor="email">邮箱</Label>
  <Input
    id="email"
    type="email"
    placeholder="输入邮箱"
  />
</div>
```

**特性：**
- 2px 黑色边框
- 10px 圆角
- 纯白背景 (#ffffff)
- 无阴影

### Table 表格

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>列1</TableHead>
      <TableHead>列2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>数据1</TableCell>
      <TableCell>数据2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**特性：**
- 表格容器：16px 圆角，3px 黑色边框，6px 阴影
- 表头：浅灰背景 (#f0f0ee)，2px 黑色底部边框
- 行分隔：1px 浅灰边框 (#e0e0e0)
- 纯白背景

## 🛠️ Tailwind 工具类

### 圆角
- `rounded-brutal-xl` - 20px（大面板）
- `rounded-brutal-lg` - 16px（中型卡片）
- `rounded-brutal-md` - 12px（按钮）
- `rounded-brutal-sm` - 10px（输入框）
- `rounded-brutal-xs` - 8px（徽章）

### 阴影
- `shadow-brutal-sm` - 2px 2px 0（小组件）
- `shadow-brutal` - 4px 4px 0（按钮）
- `shadow-brutal-lg` - 6px 6px 0（大面板）

### 边框
- `border-brutal` - 3px 黑色实线
- `border-brutal-2` - 2px 黑色实线
- `border-brutal-light` - 1px 浅灰线

### 背景色
- `bg-brutal-base` - 页面背景
- `bg-brutal-panel` - 面板背景
- `bg-brutal-white` - 纯白
- `bg-brutal-secondary` - 次要背景
- `bg-brutal-pink` - 粉色
- `bg-brutal-yellow` - 黄色
- `bg-brutal-blue` - 蓝色
- `bg-brutal-green` - 绿色

### 按压效果
- `hover-press` - 悬停时向右下移动 2px

### 文字颜色
- `text-brutal-primary` - 黑色
- `text-brutal-secondary` - 深灰

### 字体粗细
- `font-brutal-bold` - 700
- `font-brutal-semibold` - 600
- `font-brutal-normal` - 400

## 📱 示例页面

访问 `/neo-brutal-demo` 查看完整的设计系统演示，包括：

- ✅ 统计卡片
- ✅ 任务列表表格
- ✅ 设置面板
- ✅ 所有按钮变体
- ✅ 所有徽章状态
- ✅ 输入框和表单元素

## 🎯 设计规范对照

本设计系统严格遵循以下规范：

### 边框系统
- ✅ 主要组件：3px 黑色边框
- ✅ 中型组件：2px 黑色边框
- ✅ 表格分隔：1px 浅灰边框

### 圆角系统
- ✅ 大面板：20px
- ✅ 中卡片：16px
- ✅ 按钮：12px
- ✅ 输入框：10px
- ✅ 徽章：8px

### 阴影系统
- ✅ 大组件：6px x 6px 偏移
- ✅ 小组件：4px x 4px 偏移
- ✅ 无模糊硬阴影

### 颜色系统
- ✅ 浅色背景主题
- ✅ 纯黑文字
- ✅ 高对比度设计
- ✅ 鲜艳重点色

## 🚀 快速开始

1. **查看演示**
   ```bash
   pnpm dev
   # 访问 http://localhost:3000/neo-brutal-demo
   ```

2. **使用组件**
   ```tsx
   import { Button } from '@/components/ui/button'
   import { Card } from '@/components/ui/card'

   export default function MyPage() {
     return (
       <div className="min-h-screen bg-brutal-base p-8">
         <Card className="max-w-md">
           <CardContent className="pt-6">
             <Button variant="default">点击我</Button>
           </CardContent>
         </Card>
       </div>
     )
   }
   ```

3. **自定义样式**
   - 使用 Tailwind 工具类：`rounded-brutal-lg shadow-brutal border-brutal`
   - 使用 CSS 变量：`var(--color-yellow)`
   - 组合类名：`bg-brutal-yellow border-brutal rounded-brutal-md shadow-brutal`

## 📚 更多资源

- 主题配置：`src/app/(pages)/globals.css`
- Tailwind 配置：`tailwind.config.ts`
- UI 组件：`src/components/ui/`
- 演示页面：`src/app/(pages)/neo-brutal-demo/page.tsx`

---

**设计哲学：清晰、一致、易用、现代、有深度**
