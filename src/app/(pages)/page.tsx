'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { AnimatedButton } from '@/components/magicui/AnimatedButton'
import { TextRevealDemo } from '@/components/magicui/TextRevealDemo'
import { MorphingText } from '@/components/ui/morphing-text'
import {
  ChevronRight,
  Sparkles,
  Zap,
  Shield,
  Palette,
  Code,
  MessageCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'

// 流星雨组件
function Meteors({ number }: { number: number }) {
  const [meteors, setMeteors] = useState<number[]>([])

  useEffect(() => {
    setMeteors(Array.from({ length: number }, (_, i) => i))
  }, [number])

  return (
    <>
      {meteors.map((meteor) => (
        <motion.span
          key={meteor}
          className='absolute h-0.5 w-0.5 rotate-[215deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]'
          style={{
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animationDelay: Math.random() * 8 + 's',
            animationDuration: Math.random() * 8 + 2 + 's',
          }}
          animate={{
            x: [0, -400],
            y: [0, 400],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 2,
            repeat: Infinity,
            delay: Math.random() * 8,
          }}
        />
      ))}
    </>
  )
}

// 复古网格组件
function RetroGrid() {
  return (
    <div className='pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black,transparent)]'>
      <div className='absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] bg-[length:20px_20px] animate-pulse' />
      <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] bg-[length:20px_20px] animate-pulse' />
      <motion.div
        className='absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent'
        animate={{
          x: [-100, 1000],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

export default function HomePage() {
  return (
    <div className='font-sans min-h-screen bg-background relative overflow-hidden'>
      {/* 背景装饰 */}
      <div className='absolute inset-0 bg-gradient-to-br from-muted/20 via-background to-card/30' />
      <Meteors number={30} />

      <main className='relative z-10'>
        {/* Hero Section */}
        <section className='min-h-screen flex items-center justify-center p-6'>
          <div className='max-w-6xl mx-auto text-center space-y-12'>
            {/* 主标题区域 */}
            <motion.div
              className='space-y-6'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-cool text-accent text-sm font-medium mb-6'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Sparkles className='w-4 h-4' />
                AI MVP 应用模板
              </motion.div>

              <h1 className='text-6xl md:text-7xl font-bold tracking-tight'>
                <MorphingText texts={['Fast MVP', 'Fast Builder']} />
              </h1>

              <p className='text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
                现代化全栈开发模板，集成最新技术栈，
                <span className='text-primary font-semibold'>
                  让你的想法快速变为现实
                </span>
              </p>

              <motion.div
                className='flex flex-wrap justify-center gap-3 mt-8'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {[
                  { name: 'Next.js 15', color: 'bg-gradient-dark text-accent' },
                  {
                    name: 'tRPC',
                    color: 'bg-gradient-primary text-primary-foreground',
                  },
                  {
                    name: 'Drizzle ORM',
                    color: 'bg-gradient-secondary text-accent',
                  },
                  {
                    name: 'Tailwind CSS',
                    color: 'bg-gradient-accent text-accent-foreground',
                  },
                  {
                    name: 'shadcn/ui',
                    color: 'bg-gradient-warm text-background',
                  },
                  {
                    name: 'TypeScript',
                    color: 'bg-gradient-cool text-accent',
                  },
                ].map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  >
                    <Badge
                      className={`${tech.color} px-3 py-1 text-sm font-medium`}
                    >
                      {tech.name}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* CTA 按钮区域 */}
            <motion.div
              className='flex flex-col sm:flex-row gap-4 justify-center items-center'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href='/magic'>
                <AnimatedButton />
              </Link>

              <Link href='/openai'>
                <Button
                  className='h-12 px-6 text-base group bg-gradient-primary text-primary-foreground border-0 shadow-md hover:shadow-warm'
                  size='lg'
                >
                  体验 OpenAI 聊天
                  <MessageCircle className='ml-2 w-4 h-4 transition-transform group-hover:scale-110' />
                </Button>
              </Link>

              <Link href='/trpc'>
                <Button
                  variant='outline'
                  size='lg'
                  className='h-12 px-6 text-base group'
                >
                  查看 tRPC 演示
                  <ChevronRight className='ml-1 w-4 h-4 transition-transform group-hover:translate-x-1' />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className='py-20 px-6'>
          <div className='max-w-6xl mx-auto'>
            <motion.div
              className='text-center mb-16'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className='text-4xl md:text-5xl font-bold mb-6'>
                <span className='text-gradient-warm'>强大的功能特性</span>
              </h2>
              <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
                集成最新的技术栈和最佳实践，让你专注于业务逻辑而非基础设施
              </p>
            </motion.div>

            {/* 功能展示卡片 */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16'>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className='relative overflow-hidden hover:shadow-warm-xl transition-all duration-500 group border-0 bg-gradient-to-br from-card to-muted'>
                  <div className='absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-500' />
                  <CardHeader className='relative z-10'>
                    <CardTitle className='flex items-center gap-3 text-2xl'>
                      <div className='p-2 rounded-lg bg-gradient-primary'>
                        <Sparkles className='w-6 h-6 text-white' />
                      </div>
                      Magic UI 展示
                    </CardTitle>
                    <CardDescription className='text-base'>
                      精美的 UI 动画效果和交互组件展示
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='relative z-10'>
                    <p className='text-muted-foreground mb-6 leading-relaxed'>
                      体验各种动画特效、粒子效果和文字动画，为你的应用增添视觉魅力。
                      包含流星雨、粒子系统、文字揭示等炫酷效果。
                    </p>
                    <Link href='/magic'>
                      <Button className='w-full bg-gradient-primary hover:shadow-warm text-white border-0 h-12 text-base group'>
                        探索 Magic UI
                        <ChevronRight className='ml-2 w-4 h-4 transition-transform group-hover:translate-x-1' />
                      </Button>
                    </Link>
                  </CardContent>
                  <Meteors number={15} />
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className='relative overflow-hidden hover:shadow-warm-xl transition-all duration-500 group border-0 bg-gradient-to-br from-muted to-card'>
                  <div className='absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-500' />
                  <CardHeader className='relative z-10'>
                    <CardTitle className='flex items-center gap-3 text-2xl'>
                      <div className='p-2 rounded-lg bg-gradient-secondary'>
                        <Zap className='w-6 h-6 text-white' />
                      </div>
                      tRPC 示例
                    </CardTitle>
                    <CardDescription className='text-base'>
                      端到端类型安全的 API 调用演示
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='relative z-10'>
                    <p className='text-muted-foreground mb-6 leading-relaxed'>
                      完整的 tRPC + Zod + Drizzle ORM
                      示例，展示现代化全栈开发最佳实践。
                      实现真正的端到端类型安全。
                    </p>
                    <Link href='/trpc'>
                      <Button
                        variant='outline'
                        className='w-full border-2 border-primary/20 hover:bg-primary/5 h-12 text-base group'
                      >
                        查看 tRPC 演示
                        <ChevronRight className='ml-2 w-4 h-4 transition-transform group-hover:translate-x-1' />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* 技术栈特性 */}
            <motion.div
              className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                {
                  icon: Code,
                  title: '现代化框架',
                  description:
                    '基于 Next.js 15 App Router，支持 RSC 和 Server Actions',
                  gradient: 'from-primary to-accent',
                },
                {
                  icon: Shield,
                  title: '类型安全',
                  description:
                    'tRPC + Zod 实现端到端类型安全，一次定义全栈共享',
                  gradient: 'from-secondary to-muted-foreground',
                },
                {
                  icon: Palette,
                  title: '美观界面',
                  description: 'shadcn/ui + Tailwind CSS 构建现代化用户界面',
                  gradient: 'from-destructive to-accent',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className='text-center p-6 hover:shadow-warm transition-all duration-300 border-0 bg-gradient-to-br from-card to-secondary'>
                    <div
                      className={`inline-flex p-3 rounded-full bg-gradient-to-r ${feature.gradient} mb-4`}
                    >
                      <feature.icon className='w-6 h-6 text-white' />
                    </div>
                    <h3 className='text-xl font-semibold mb-3'>
                      {feature.title}
                    </h3>
                    <p className='text-muted-foreground leading-relaxed'>
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className='py-20 px-6 bg-gradient-to-br from-muted to-secondary'>
          <div className='max-w-4xl mx-auto'>
            <motion.div
              className='text-center mb-12'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className='text-4xl font-bold mb-6'>
                <span className='text-gradient-primary'>交互式演示</span>
              </h2>
              <p className='text-xl text-muted-foreground'>
                体验 MagicUI 的强大动画效果
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <TextRevealDemo />
            </motion.div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section className='py-20 px-6'>
          <div className='max-w-4xl mx-auto'>
            <motion.div
              className='text-center mb-12'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className='text-4xl font-bold mb-6'>
                <span className='text-gradient-accent'>快速开始</span>
              </h2>
              <p className='text-xl text-muted-foreground'>
                三步即可启动你的项目
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className='relative overflow-hidden bg-gradient-dark text-foreground border-0'>
                <CardContent className='p-8'>
                  <div className='space-y-6'>
                    {[
                      {
                        step: '1',
                        command: 'pnpm install',
                        description: '安装项目依赖',
                      },
                      {
                        step: '2',
                        command: 'pnpm db:push',
                        description: '初始化数据库',
                      },
                      {
                        step: '3',
                        command: 'pnpm dev',
                        description: '启动开发服务器',
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={item.step}
                        className='flex items-center gap-4 p-4 rounded-lg bg-card/20 backdrop-blur-sm'
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        viewport={{ once: true }}
                      >
                        <Badge className='bg-gradient-primary text-primary-foreground px-3 py-1 text-lg font-bold'>
                          {item.step}
                        </Badge>
                        <code className='flex-1 bg-background/50 px-4 py-2 rounded font-mono text-accent'>
                          {item.command}
                        </code>
                        <span className='text-muted-foreground text-sm'>
                          {item.description}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className='mt-8 text-center'
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <p className='text-muted-foreground mb-4'>
                      然后访问{' '}
                      <code className='bg-card/20 px-2 py-1 rounded text-accent'>
                        http://localhost:3000
                      </code>
                    </p>
                    <div className='flex justify-center gap-4'>
                      <Link href='/magic'>
                        <Button className='bg-gradient-primary hover:shadow-warm text-primary-foreground border-0'>
                          开始探索
                        </Button>
                      </Link>
                      <Link href='/trpc'>
                        <Button
                          variant='outline'
                          className='border-border text-foreground hover:bg-card/20'
                        >
                          查看示例
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </CardContent>
                <RetroGrid />
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className='py-12 px-6 bg-gradient-dark text-foreground'>
          <div className='max-w-4xl mx-auto text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className='text-2xl font-bold mb-4'>
                <span className='text-gradient-accent'>Fast MVP</span>
              </h3>
              <p className='text-muted-foreground mb-6'>
                现代化全栈开发模板，让你的想法快速变为现实
              </p>
              <div className='flex justify-center gap-4'>
                <Badge
                  variant='outline'
                  className='border-border text-muted-foreground'
                >
                  MIT License
                </Badge>
                <Badge
                  variant='outline'
                  className='border-border text-muted-foreground'
                >
                  Open Source
                </Badge>
              </div>
            </motion.div>
          </div>
        </footer>
      </main>
    </div>
  )
}
