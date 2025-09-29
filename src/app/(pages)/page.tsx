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
  MessageCircle,
  Users,
  FileText,
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
                className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-primary text-primary-foreground text-sm font-medium mb-6'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Sparkles className='w-4 h-4' />
                多专家讨论系统
              </motion.div>

              <h1 className='text-6xl md:text-7xl font-bold tracking-tight'>
                <MorphingText texts={['AI Experts']} />
              </h1>

              <p className='text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
                提出一个话题，
                <span className='text-primary font-semibold'>
                  AI专家团队深度讨论，自动生成专业白皮书
                </span>
              </p>
            </motion.div>

            {/* CTA 按钮区域 */}
            <motion.div
              className='flex justify-center items-center'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href='/experts'>
                <Button
                  className='h-16 px-12 text-xl group bg-gradient-primary text-primary-foreground border-0 shadow-warm hover:shadow-warm-lg'
                  size='lg'
                >
                  开始专家讨论
                  <Users className='ml-3 w-6 h-6 transition-transform group-hover:scale-110' />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className='py-20 px-6'>
          <div className='max-w-4xl mx-auto'>
            <motion.div
              className='text-center mb-16'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className='text-4xl md:text-5xl font-bold mb-6'>
                <span className='text-gradient-warm'>如何使用</span>
              </h2>
              <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
                四步完成专业的多专家讨论与白皮书生成
              </p>
            </motion.div>

            {/* 使用流程 */}
            <motion.div
              className='space-y-6 mb-16'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                {
                  step: '1',
                  title: '输入讨论话题',
                  description: '提出一个你想深入探讨的问题或主题',
                  icon: MessageCircle,
                },
                {
                  step: '2',
                  title: 'AI生成专家团队',
                  description: '系统自动创建5位不同领域的专业AI专家',
                  icon: Users,
                },
                {
                  step: '3',
                  title: '专家自由讨论',
                  description: '点击专家头像让他们发言，流式输出实时观看',
                  icon: Sparkles,
                },
                {
                  step: '4',
                  title: '生成专业白皮书',
                  description: '一键总结讨论内容，生成结构化的Markdown白皮书',
                  icon: FileText,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  className='flex items-start gap-6 p-6 rounded-xl bg-gradient-to-br from-card to-muted hover:shadow-warm transition-all duration-300'
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                >
                  <div className='flex-shrink-0'>
                    <div className='w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center'>
                      <item.icon className='w-7 h-7 text-white' />
                    </div>
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <Badge className='bg-gradient-primary text-primary-foreground px-2 py-0.5 text-sm font-bold'>
                        步骤 {item.step}
                      </Badge>
                      <h3 className='text-xl font-semibold'>{item.title}</h3>
                    </div>
                    <p className='text-muted-foreground leading-relaxed'>
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              className='text-center'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Link href='/experts'>
                <Button
                  size='lg'
                  className='h-16 px-12 text-xl bg-gradient-primary hover:shadow-warm-lg text-white border-0'
                >
                  <Users className='mr-3 w-6 h-6' />
                  立即开始讨论
                  <ChevronRight className='ml-3 w-6 h-6' />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className='py-8 px-6 bg-gradient-dark text-foreground'>
          <div className='max-w-4xl mx-auto text-center'>
            <p className='text-sm text-muted-foreground'>
              多专家讨论系统 - AI驱动的深度分析与白皮书生成
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
