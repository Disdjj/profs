import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold text-black ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-brutal-yellow border-brutal rounded-brutal-md shadow-brutal hover-press',
        destructive:
          'bg-brutal-pink border-brutal rounded-brutal-md shadow-brutal hover-press',
        outline:
          'border-brutal-2 bg-white rounded-brutal-md shadow-brutal hover-press',
        secondary:
          'bg-brutal-blue border-brutal rounded-brutal-md shadow-brutal hover-press',
        success:
          'bg-brutal-green border-brutal rounded-brutal-md shadow-brutal hover-press',
        ghost: 'hover:bg-brutal-secondary',
        link: 'underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-12 px-7 py-3',
        sm: 'h-10 px-5 py-2 rounded-brutal-sm',
        lg: 'h-14 px-9 py-4 rounded-brutal-md',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
