import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-brutal-xs px-3 py-1 text-xs font-semibold text-black transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-brutal-yellow',
        secondary: 'bg-brutal-blue',
        success: 'bg-brutal-green',
        destructive: 'bg-brutal-pink',
        outline: 'border-brutal-2 bg-white',
        inProgress: 'bg-brutal-blue',
        completed: 'bg-brutal-green',
        queued: 'border-brutal-2 bg-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
