import { MagicShowcase } from '@/components/magicui/MagicShowcase'

export default function MagicPage() {
  return (
    <div className='font-sans min-h-screen bg-background'>
      <main className='flex flex-col'>
        <MagicShowcase />
        <div className='p-4 md:p-6'>
          <div className='max-w-6xl mx-auto text-center'>
            <h1 className='text-4xl font-bold tracking-tight mb-4'>
              Magic UI 动画展示
            </h1>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              这里展示了各种精美的 UI 动画效果和交互组件，
              为你的应用增添视觉魅力。
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
