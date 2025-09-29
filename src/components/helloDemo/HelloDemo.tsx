'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function HelloDemo() {
  const [name, setName] = useState('')
  const [selectedName, setSelectedName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const utils = trpc.useUtils()

  // 使用tRPC mutations
  const sayHelloMutation = trpc.hello.sayHello.useMutation({
    onSuccess: () => {
      // 成功后刷新所有记录
      utils.hello.getAll.invalidate()
      // 清空输入框
      setName('')
      // 清空选中的名字以隐藏查询结果
      if (selectedName === name.trim()) {
        setSelectedName('')
      }
    },
  })

  // 使用tRPC queries - 直接使用，无需封装
  const getCountQuery = trpc.hello.getCount.useQuery(
    { name: selectedName },
    {
      enabled: !!selectedName,
    },
  )

  const getAllQuery = trpc.hello.getAll.useQuery()

  // 过滤记录
  const filteredRecords =
    getAllQuery.data?.filter((record) =>
      record.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  // 统计信息
  const totalRecords = getAllQuery.data?.length || 0
  const totalGreetings =
    getAllQuery.data?.reduce((sum, record) => sum + record.count, 0) || 0

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-6'>
      {/* 统计概览卡片 */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>总用户数</CardTitle>
            <Badge variant='secondary'>{totalRecords}</Badge>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalRecords}</div>
            <p className='text-xs text-muted-foreground'>已注册用户</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>总问候次数</CardTitle>
            <Badge variant='default'>{totalGreetings}</Badge>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalGreetings}</div>
            <p className='text-xs text-muted-foreground'>累计问候次数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>平均问候数</CardTitle>
            <Badge variant='outline'>
              {totalRecords > 0
                ? (totalGreetings / totalRecords).toFixed(1)
                : '0'}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {totalRecords > 0
                ? (totalGreetings / totalRecords).toFixed(1)
                : '0'}
            </div>
            <p className='text-xs text-muted-foreground'>每用户平均</p>
          </CardContent>
        </Card>
      </div>

      {/* 主操作区域 */}
      <Card>
        <CardHeader>
          <CardTitle>问候系统</CardTitle>
          <CardDescription>输入名字进行问候或查询问候次数</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>姓名</Label>
            <Input
              id='name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='请输入姓名...'
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  sayHelloMutation.mutate({ name: name.trim() })
                }
              }}
            />
          </div>

          <div className='flex gap-2'>
            <Button
              onClick={() =>
                name.trim() && sayHelloMutation.mutate({ name: name.trim() })
              }
              disabled={sayHelloMutation.isPending || !name.trim()}
              className='flex-1'
            >
              {sayHelloMutation.isPending ? '处理中...' : '👋 说Hello'}
            </Button>

            <Button
              variant='outline'
              onClick={() => name.trim() && setSelectedName(name.trim())}
              disabled={!name.trim()}
              className='flex-1'
            >
              🔍 查询次数
            </Button>
          </div>

          {/* 显示mutation结果 */}
          {sayHelloMutation.data && (
            <Card className='border-primary/50 bg-primary/10'>
              <CardContent className='pt-4'>
                <div className='flex items-center gap-2'>
                  <Badge variant='default'>成功</Badge>
                  <span className='text-sm font-medium'>
                    {sayHelloMutation.data.message}
                  </span>
                </div>
                <p className='text-sm text-muted-foreground mt-1'>
                  当前次数: {sayHelloMutation.data.count}
                </p>
              </CardContent>
            </Card>
          )}

          {/* 显示查询结果 */}
          {getCountQuery.data && selectedName && (
            <Card className='border-primary/50 bg-primary/10'>
              <CardContent className='pt-4'>
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary'>查询结果</Badge>
                  <span className='text-sm font-medium'>
                    {getCountQuery.data.message}
                  </span>
                </div>
                <p className='text-sm text-muted-foreground mt-1'>
                  问候次数: {getCountQuery.data.count}
                </p>
              </CardContent>
            </Card>
          )}

          {/* 显示错误 */}
          {(sayHelloMutation.error || getCountQuery.error) && (
            <Card className='border-primary/50  border-red-200'>
              <CardContent className='pt-4'>
                <div className='flex items-center gap-2'>
                  <Badge variant='destructive'>错误</Badge>
                  <span className='text-sm font-medium'>
                    {sayHelloMutation.error?.message ||
                      getCountQuery.error?.message}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* 记录列表 */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>问候记录</CardTitle>
              <CardDescription>所有用户的问候历史记录</CardDescription>
            </div>
            <Badge variant='outline'>{filteredRecords.length} 条记录</Badge>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='search'>搜索用户</Label>
            <Input
              id='search'
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='搜索用户名...'
            />
          </div>
        </CardHeader>
        <CardContent>
          {getAllQuery.isLoading ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-sm text-muted-foreground'>加载中...</div>
            </div>
          ) : filteredRecords.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>问候次数</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className='font-medium'>#{record.id}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={record.count > 5 ? 'default' : 'secondary'}
                      >
                        {record.count} 次
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setSelectedName(record.name)}
                      >
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <p className='text-sm text-muted-foreground mb-2'>
                {searchQuery ? '没有找到匹配的记录' : '暂无问候记录'}
              </p>
              {!searchQuery && (
                <p className='text-xs text-muted-foreground'>
                  输入姓名并点击&quot;说Hello&quot;开始使用
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
