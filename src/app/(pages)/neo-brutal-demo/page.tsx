'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Label } from '@/components/ui/label'

export default function NeoBrutalDemoPage() {
  return (
    <div className="min-h-screen bg-brutal-base p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* 标题部分 */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-black">My Workspace</h1>
          <p className="mt-2 text-lg text-brutal-text-secondary">
            Neo-Brutalism 设计系统演示
          </p>
        </div>

        {/* 统计卡片行 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-sm text-brutal-text-secondary">Total Tasks</p>
              <p className="mt-2 text-4xl font-bold text-black">30</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-sm text-brutal-text-secondary">In Progress</p>
              <p className="mt-2 text-4xl font-bold text-black">19</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-sm text-brutal-text-secondary">Completed</p>
              <p className="mt-2 text-4xl font-bold text-black">1</p>
            </CardContent>
          </Card>
        </div>

        {/* 主内容区 - 左侧表格和右侧设置 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 主表格面板 */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>任务列表</CardTitle>
                <CardDescription>管理你的所有任务</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button variant="default" size="default">
                  ✨ New Task
                </Button>
                <Button variant="destructive" size="default">
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Task Name</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Badge variant="inProgress">In Progress</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      实现新的登录界面
                    </TableCell>
                    <TableCell>2025-10-15</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge variant="completed">Completed</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      修复导航栏 bug
                    </TableCell>
                    <TableCell>2025-10-12</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge variant="queued">Queued</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      优化数据库查询
                    </TableCell>
                    <TableCell>2025-10-20</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge variant="inProgress">In Progress</Badge>
                    </TableCell>
                    <TableCell className="font-medium">编写单元测试</TableCell>
                    <TableCell>2025-10-18</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 设置面板 */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>配置你的偏好设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="输入用户名"
                  defaultValue="user@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project" className="text-sm font-semibold">
                  Project Name
                </Label>
                <Input
                  id="project"
                  placeholder="输入项目名称"
                  defaultValue="My Project"
                />
              </div>

              <div className="flex items-center justify-between rounded-brutal-sm border-brutal-2 bg-white p-4">
                <div>
                  <p className="font-semibold text-black">Notifications</p>
                  <p className="text-xs text-brutal-text-secondary">
                    接收任务更新通知
                  </p>
                </div>
                <div className="toggle-brutal active relative h-8 w-14">
                  <div className="knob absolute right-1 top-1 h-6 w-6"></div>
                </div>
              </div>

              <Button variant="secondary" className="w-full">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 按钮演示区 */}
        <Card>
          <CardHeader>
            <CardTitle>按钮组件演示</CardTitle>
            <CardDescription>
              展示不同变体和尺寸的按钮
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold">按钮变体：</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">按钮尺寸：</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">📌</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge 演示区 */}
        <Card>
          <CardHeader>
            <CardTitle>徽章组件演示</CardTitle>
            <CardDescription>
              展示不同状态的徽章
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="inProgress">In Progress</Badge>
              <Badge variant="completed">Completed</Badge>
              <Badge variant="queued">Queued</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
