'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

export function ParticleDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置画布尺寸
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 初始化粒子
    const initParticles = () => {
      const newParticles: Particle[] = []
      for (let i = 0; i < 100; i++) {
        newParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.1,
        })
      }
      setParticles(newParticles)
    }

    initParticles()

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          // 更新位置
          let newX = particle.x + particle.vx
          let newY = particle.y + particle.vy

          // 边界检测
          if (newX < 0 || newX > canvas.width) particle.vx *= -1
          if (newY < 0 || newY > canvas.height) particle.vy *= -1

          newX = Math.max(0, Math.min(canvas.width, newX))
          newY = Math.max(0, Math.min(canvas.height, newY))

          return { ...particle, x: newX, y: newY }
        }),
      )

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 绘制粒子
    particles.forEach((particle) => {
      ctx.save()
      ctx.globalAlpha = particle.opacity
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })

    // 绘制连线
    particles.forEach((particle, i) => {
      particles.slice(i + 1).forEach((otherParticle) => {
        const distance = Math.sqrt(
          Math.pow(particle.x - otherParticle.x, 2) +
            Math.pow(particle.y - otherParticle.y, 2),
        )

        if (distance < 100) {
          ctx.save()
          ctx.globalAlpha = (1 - distance / 100) * 0.2
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(otherParticle.x, otherParticle.y)
          ctx.stroke()
          ctx.restore()
        }
      })
    })
  }, [particles])

  return (
    <div
      ref={containerRef}
      className='relative flex h-96 w-full items-center justify-center overflow-hidden rounded-lg border bg-black'
    >
      <motion.span
        className='pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-white to-gray-300 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent'
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        MagicUI
      </motion.span>
      <canvas ref={canvasRef} className='absolute inset-0' />
    </div>
  )
}
