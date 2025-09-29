'use client'

import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function AnimatedButton() {
  return (
    <motion.div
      className='relative'
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        className='group relative h-12 px-6 text-base font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 overflow-hidden'
        size='lg'
      >
        <motion.div
          className='flex items-center relative z-10'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ✨ MagicUI 示例按钮
          <ChevronRight className='ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5' />
        </motion.div>

        {/* Animated background */}
        <motion.div
          className='absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
          initial={false}
        />

        {/* Border animation */}
        <motion.div
          className='absolute inset-0 rounded-md'
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            transform: 'translateX(-100%)',
          }}
          animate={{
            transform: 'translateX(300%)',
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </Button>
    </motion.div>
  )
}
