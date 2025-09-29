'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Label } from '@/components/ui/label'
import { trpc } from '@/lib/trpc/client'
import {
  Loader2,
  Users,
  MessageCircle,
  FileText,
  Sparkles,
  Settings,
  ChevronRight,
  Edit,
  Copy,
  Download,
  Check,
} from 'lucide-react'
import type { ExpertConfig, Message } from '@/lib/schema/expert'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'

export default function ExpertsPage() {
  const [topic, setTopic] = useState('')
  const [experts, setExperts] = useState<ExpertConfig[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [whitepaper, setWhitepaper] = useState('')
  const [selectedExpert, setSelectedExpert] = useState<ExpertConfig | null>(
    null,
  )
  const [activeTab, setActiveTab] = useState<'discussion' | 'whitepaper'>(
    'discussion',
  )
  const [streamingMessage, setStreamingMessage] = useState<{
    expertName: string
    content: string
  } | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamError, setStreamError] = useState<string | null>(null)
  const [editingExpert, setEditingExpert] = useState<ExpertConfig | null>(null)
  const [editModel, setEditModel] = useState('')
  const [editTemperature, setEditTemperature] = useState(0.7)
  const [copied, setCopied] = useState(false)

  const generateExpertsMutation = trpc.expert.generateExperts.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setExperts(data.experts)
      }
    },
  })

  // Not used anymore - using streaming API directly
  // const expertSpeakMutation = trpc.expert.expertSpeak.useMutation({
  //   onSuccess: (data) => {
  //     if (data.success && selectedExpert) {
  //       const newMessage: Message = {
  //         id: Date.now().toString(),
  //         expertName: selectedExpert.name,
  //         content: data.message,
  //         timestamp: Date.now(),
  //       }
  //       setMessages((prev) => [...prev, newMessage])
  //       setSelectedExpert(null)
  //     }
  //   },
  // })

  const generateWhitepaperMutation =
    trpc.expert.generateWhitepaper.useMutation({
      onSuccess: (data) => {
        if (data.success) {
          setWhitepaper(data.whitepaper)
          setActiveTab('whitepaper')
        }
      },
    })

  const handleGenerateExperts = () => {
    if (!topic.trim()) return
    generateExpertsMutation.mutate({
      topic: topic.trim(),
      count: 5,
      provider: 'openai',
    })
  }

  const handleExpertSpeak = async (expert: ExpertConfig) => {
    setSelectedExpert(expert)
    setIsStreaming(true)
    setStreamingMessage({ expertName: expert.name, content: '' })
    setStreamError(null)

    try {
      const response = await fetch('/api/expert/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expertConfig: expert,
          discussionHistory: messages,
          topic: topic.trim(),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Stream request failed (${response.status}): ${errorText}`,
        )
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          accumulatedContent += chunk

          setStreamingMessage({
            expertName: expert.name,
            content: accumulatedContent,
          })
        }
      }

      // Save the complete message
      const newMessage: Message = {
        id: Date.now().toString(),
        expertName: expert.name,
        content: accumulatedContent,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, newMessage])
      setStreamingMessage(null)
      setSelectedExpert(null)
    } catch (error) {
      console.error('Streaming failed:', error)
      const errorMessage =
        error instanceof Error ? error.message : '流式生成失败'
      setStreamError(errorMessage)
      setStreamingMessage(null)
      setSelectedExpert(null)
    } finally {
      setIsStreaming(false)
    }
  }

  const handleGenerateWhitepaper = () => {
    if (messages.length === 0) return
    generateWhitepaperMutation.mutate({
      topic: topic.trim(),
      discussionHistory: messages,
      provider: 'openai',
    })
  }

  const handleEditExpert = (expert: ExpertConfig) => {
    setEditingExpert(expert)
    setEditModel(expert.model || '')
    setEditTemperature(expert.temperature || 0.7)
  }

  const handleSaveExpertConfig = () => {
    if (!editingExpert) return

    const updatedExperts = experts.map((exp) =>
      exp.name === editingExpert.name
        ? { ...exp, model: editModel || undefined, temperature: editTemperature }
        : exp,
    )
    setExperts(updatedExperts)
    setEditingExpert(null)
  }

  const handleCopyWhitepaper = async () => {
    if (!whitepaper) return
    try {
      await navigator.clipboard.writeText(whitepaper)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleDownloadWhitepaper = () => {
    if (!whitepaper) return
    const blob = new Blob([whitepaper], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `whitepaper-${topic.replace(/\s+/g, '-')}-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className='h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/30 overflow-hidden flex flex-col'>
      {/* Header */}
      <header className='border-b border-border bg-card/80 backdrop-blur-sm px-6 py-4 shadow-sm'>
        <div className='max-w-screen-2xl mx-auto'>
          <motion.div
            className='flex items-center justify-between'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center'>
                <Users className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gradient-primary'>
                  多专家讨论系统
                </h1>
                <p className='text-sm text-muted-foreground'>
                  AI驱动的深度讨论与白皮书生成
                </p>
              </div>
            </div>

            {experts.length > 0 && (
              <div className='flex items-center gap-2'>
                <Badge variant='outline' className='gap-1'>
                  <Users className='w-3 h-3' />
                  {experts.length} 位专家
                </Badge>
                <Badge variant='outline' className='gap-1'>
                  <MessageCircle className='w-3 h-3' />
                  {messages.length} 条讨论
                </Badge>
              </div>
            )}
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <div className='flex-1 overflow-hidden flex max-w-screen-2xl mx-auto w-full'>
        {/* Left Sidebar - Experts */}
        <div className='w-80 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col overflow-hidden'>
          {/* Topic Input Section */}
          <div className='p-4 border-b border-border'>
            {experts.length === 0 ? (
              <motion.div
                className='space-y-3'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div>
                  <label className='text-sm font-medium mb-1.5 block'>
                    讨论话题
                  </label>
                  <Input
                    placeholder='例如：人工智能的未来发展趋势'
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleGenerateExperts}
                  disabled={!topic.trim() || generateExpertsMutation.isPending}
                  className='w-full bg-gradient-primary hover:shadow-warm'
                >
                  {generateExpertsMutation.isPending ? (
                    <>
                      <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                      生成专家中...
                    </>
                  ) : (
                    <>
                      <Sparkles className='mr-2 w-4 h-4' />
                      生成讨论专家
                    </>
                  )}
                </Button>

                {generateExpertsMutation.isError && (
                  <Alert variant='destructive' className='mt-2'>
                    <AlertDescription className='text-xs'>
                      {generateExpertsMutation.error.message}
                    </AlertDescription>
                  </Alert>
                )}
              </motion.div>
            ) : (
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-sm font-semibold'>参会专家</h3>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      setExperts([])
                      setMessages([])
                      setWhitepaper('')
                      setActiveTab('discussion')
                    }}
                    className='h-7 px-2 text-xs'
                  >
                    重置
                  </Button>
                </div>
                <p className='text-xs text-muted-foreground'>
                  话题：{topic}
                </p>
              </div>
            )}
          </div>

          {/* Experts List */}
          {experts.length > 0 && (
            <div className='flex-1 overflow-y-auto p-4 space-y-2'>
              <AnimatePresence>
                {experts.map((expert, index) => {
                  const isSpeaking =
                    selectedExpert?.name === expert.name && isStreaming
                  const messageCount = messages.filter(
                    (m) => m.expertName === expert.name,
                  ).length

                  return (
                    <ContextMenu key={expert.name}>
                      <ContextMenuTrigger asChild>
                        <motion.button
                          onClick={() => handleExpertSpeak(expert)}
                          disabled={isStreaming}
                          className='w-full text-left p-3 rounded-lg bg-gradient-to-br from-card to-muted hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-primary/20 relative group'
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSpeaking && (
                            <div className='absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center backdrop-blur-sm'>
                              <Loader2 className='w-5 h-5 animate-spin text-primary' />
                            </div>
                          )}

                          <div className='flex items-start gap-3'>
                            <Avatar className='w-12 h-12 flex-shrink-0 ring-2 ring-primary/20 group-hover:ring-primary transition-all'>
                              <AvatarImage src={expert.avatar} alt={expert.name} />
                              <AvatarFallback className='text-xs'>
                                {expert.name.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>

                            <div className='flex-1 min-w-0'>
                              <div className='flex items-center justify-between gap-2 mb-1'>
                                <h4 className='font-semibold text-sm truncate'>
                                  {expert.name}
                                </h4>
                                {messageCount > 0 && (
                                  <Badge
                                    variant='secondary'
                                    className='text-xs px-1.5 py-0'
                                  >
                                    {messageCount}
                                  </Badge>
                                )}
                              </div>
                              <p className='text-xs text-muted-foreground line-clamp-2 mb-2'>
                                {expert.role}
                              </p>
                              {expert.model && (
                                <Badge variant='outline' className='text-xs px-1.5 py-0'>
                                  {expert.model}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          onClick={() => handleEditExpert(expert)}
                          className='gap-2'
                        >
                          <Settings className='w-4 h-4' />
                          编辑配置
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right Content Area */}
        <div className='flex-1 flex flex-col overflow-hidden'>
          {experts.length === 0 ? (
            <div className='flex-1 flex items-center justify-center p-6'>
              <motion.div
                className='text-center max-w-md'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className='w-20 h-20 rounded-full bg-gradient-primary/10 flex items-center justify-center mx-auto mb-6'>
                  <Users className='w-10 h-10 text-primary' />
                </div>
                <h2 className='text-2xl font-bold mb-3'>开始新的讨论</h2>
                <p className='text-muted-foreground mb-6'>
                  输入一个话题，系统将自动生成多位不同领域的AI专家，
                  进行深度讨论并生成专业白皮书
                </p>
                <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
                  <ChevronRight className='w-4 h-4' />
                  <span>在左侧输入话题开始</span>
                </div>
              </motion.div>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className='border-b border-border bg-card/50 px-6 py-2'>
                <div className='flex items-center gap-4'>
                  <button
                    onClick={() => setActiveTab('discussion')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      activeTab === 'discussion'
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <MessageCircle className='w-4 h-4 inline mr-2' />
                    讨论记录
                  </button>
                  <button
                    onClick={() => setActiveTab('whitepaper')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      activeTab === 'whitepaper'
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <FileText className='w-4 h-4 inline mr-2' />
                    白皮书
                    {whitepaper && (
                      <Badge className='ml-2 bg-accent text-accent-foreground'>
                        已生成
                      </Badge>
                    )}
                  </button>

                  {activeTab === 'discussion' && messages.length > 0 && (
                    <div className='ml-auto'>
                      <Button
                        onClick={handleGenerateWhitepaper}
                        disabled={generateWhitepaperMutation.isPending}
                        className='bg-gradient-secondary hover:shadow-warm'
                        size='sm'
                      >
                        {generateWhitepaperMutation.isPending ? (
                          <>
                            <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                            生成中...
                          </>
                        ) : (
                          <>
                            <FileText className='mr-2 w-4 h-4' />
                            生成白皮书
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div className='flex-1 overflow-y-auto p-6'>
                <AnimatePresence mode='wait'>
                  {activeTab === 'discussion' ? (
                    <motion.div
                      key='discussion'
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className='space-y-4'
                    >
                      {messages.length === 0 && !streamingMessage ? (
                        <div className='text-center py-12'>
                          <MessageCircle className='w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50' />
                          <p className='text-muted-foreground'>
                            点击左侧专家头像开始讨论
                          </p>
                        </div>
                      ) : (
                        <>
                          {messages.map((message, index) => {
                            const expert = experts.find(
                              (e) => e.name === message.expertName,
                            )
                            return (
                              <motion.div
                                key={message.id}
                                className='flex gap-4 p-5 rounded-xl bg-gradient-to-br from-card to-muted border border-border/50 shadow-sm hover:shadow-md transition-shadow'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Avatar className='w-12 h-12 flex-shrink-0 ring-2 ring-primary/20'>
                                  <AvatarImage
                                    src={expert?.avatar}
                                    alt={message.expertName}
                                  />
                                  <AvatarFallback>
                                    {message.expertName.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className='flex-1 min-w-0'>
                                  <div className='flex items-center gap-2 mb-2'>
                                    <span className='font-semibold text-base'>
                                      {message.expertName}
                                    </span>
                                    <span className='text-xs text-muted-foreground'>
                                      {expert?.role}
                                    </span>
                                    {expert?.model && (
                                      <Badge
                                        variant='outline'
                                        className='text-xs'
                                      >
                                        {expert.model}
                                      </Badge>
                                    )}
                                  </div>
                                  <article className='prose prose-sm prose-invert max-w-none
                                    prose-p:text-foreground prose-p:my-2
                                    prose-strong:text-primary prose-strong:font-semibold
                                    prose-ul:my-2 prose-li:my-1
                                    prose-code:text-accent prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none'>
                                    <ReactMarkdown>
                                      {message.content}
                                    </ReactMarkdown>
                                  </article>
                                </div>
                              </motion.div>
                            )
                          })}

                          {/* Streaming Message */}
                          {streamingMessage && (
                            <motion.div
                              className='flex gap-4 p-5 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/30 shadow-md'
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <Avatar className='w-12 h-12 flex-shrink-0 ring-2 ring-primary'>
                                <AvatarImage
                                  src={
                                    experts.find(
                                      (e) =>
                                        e.name === streamingMessage.expertName,
                                    )?.avatar
                                  }
                                  alt={streamingMessage.expertName}
                                />
                                <AvatarFallback>
                                  {streamingMessage.expertName.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className='flex-1 min-w-0'>
                                <div className='flex items-center gap-2 mb-2'>
                                  <span className='font-semibold text-base'>
                                    {streamingMessage.expertName}
                                  </span>
                                  <Badge
                                    variant='default'
                                    className='text-xs gap-1 bg-primary/80 animate-pulse'
                                  >
                                    <Loader2 className='w-3 h-3 animate-spin' />
                                    生成中
                                  </Badge>
                                </div>
                                <article className='prose prose-sm prose-invert max-w-none
                                  prose-p:text-foreground prose-p:my-2
                                  prose-strong:text-primary prose-strong:font-semibold
                                  prose-ul:my-2 prose-li:my-1
                                  prose-code:text-accent prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none'>
                                  <ReactMarkdown>
                                    {streamingMessage.content}
                                  </ReactMarkdown>
                                  <span className='inline-block w-2 h-4 bg-primary animate-pulse ml-1' />
                                </article>
                              </div>
                            </motion.div>
                          )}
                        </>
                      )}

                      {/* Error Display */}
                      {streamError && (
                        <Alert variant='destructive'>
                          <AlertDescription>{streamError}</AlertDescription>
                        </Alert>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key='whitepaper'
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className='max-w-4xl mx-auto'
                    >
                      {whitepaper ? (
                        <div className='space-y-4'>
                          {/* 操作按钮 */}
                          <div className='flex items-center justify-end gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={handleCopyWhitepaper}
                              className='gap-2'
                            >
                              {copied ? (
                                <>
                                  <Check className='w-4 h-4' />
                                  已复制
                                </>
                              ) : (
                                <>
                                  <Copy className='w-4 h-4' />
                                  复制
                                </>
                              )}
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={handleDownloadWhitepaper}
                              className='gap-2'
                            >
                              <Download className='w-4 h-4' />
                              导出 Markdown
                            </Button>
                          </div>

                          {/* 白皮书内容 */}
                          <div className='p-8 rounded-xl bg-gradient-to-br from-card to-background border border-border shadow-lg'>
                            <article className='prose prose-lg prose-invert max-w-none
                              prose-headings:font-bold
                              prose-h1:text-5xl prose-h1:mb-8 prose-h1:text-primary
                              prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-6 prose-h2:text-primary/90
                              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-primary/80
                              prose-p:text-foreground prose-p:leading-relaxed prose-p:my-4
                              prose-strong:text-primary prose-strong:font-semibold
                              prose-ul:my-6 prose-li:my-2 prose-li:text-foreground
                              prose-code:text-accent prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                              prose-a:text-primary prose-a:no-underline hover:prose-a:underline'>
                              <ReactMarkdown>{whitepaper}</ReactMarkdown>
                            </article>
                          </div>
                        </div>
                      ) : (
                        <div className='text-center py-12'>
                          <FileText className='w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50' />
                          <p className='text-muted-foreground mb-4'>
                            尚未生成白皮书
                          </p>
                          {messages.length > 0 && (
                            <Button
                              onClick={handleGenerateWhitepaper}
                              disabled={generateWhitepaperMutation.isPending}
                              className='bg-gradient-primary hover:shadow-warm'
                            >
                              <FileText className='mr-2 w-4 h-4' />
                              立即生成
                            </Button>
                          )}
                        </div>
                      )}

                      {generateWhitepaperMutation.isError && (
                        <Alert variant='destructive' className='mt-4'>
                          <AlertDescription>
                            {generateWhitepaperMutation.error.message}
                          </AlertDescription>
                        </Alert>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Expert Dialog */}
      <Dialog open={!!editingExpert} onOpenChange={() => setEditingExpert(null)}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Settings className='w-5 h-5' />
              编辑专家配置
            </DialogTitle>
            <DialogDescription>
              修改 {editingExpert?.name} 的模型配置
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='expert-name'>专家名称</Label>
              <Input
                id='expert-name'
                value={editingExpert?.name || ''}
                disabled
                className='bg-muted'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='expert-role'>角色</Label>
              <Input
                id='expert-role'
                value={editingExpert?.role || ''}
                disabled
                className='bg-muted'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='model-id'>模型 ID</Label>
              <Input
                id='model-id'
                placeholder='例如：gpt-4o, gpt-4-turbo'
                value={editModel}
                onChange={(e) => setEditModel(e.target.value)}
              />
              <p className='text-xs text-muted-foreground'>
                留空使用默认模型
              </p>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='temperature'>Temperature: {editTemperature}</Label>
              <input
                id='temperature'
                type='range'
                min='0'
                max='2'
                step='0.1'
                value={editTemperature}
                onChange={(e) => setEditTemperature(parseFloat(e.target.value))}
                className='w-full'
              />
              <div className='flex justify-between text-xs text-muted-foreground'>
                <span>精确 (0)</span>
                <span>平衡 (1)</span>
                <span>创造 (2)</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setEditingExpert(null)}
            >
              取消
            </Button>
            <Button onClick={handleSaveExpertConfig} className='bg-gradient-primary'>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}