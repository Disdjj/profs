import HelloDemo from '@/components/helloDemo/HelloDemo'

export default function TrpcPage() {
  return (
    <div className='font-sans min-h-screen bg-background'>
      <main className='flex flex-col'>
        <div className='p-4 md:p-6'>
          <div className='max-w-6xl mx-auto'>
            <div className='mb-8 text-center'>
              <h1 className='text-4xl font-bold tracking-tight mb-4'>
                tRPC 示例演示
              </h1>
              <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                这是一个完整的 tRPC + Zod + Drizzle ORM 的端到端类型安全示例，
                展示了如何构建现代化的全栈应用。
              </p>
            </div>
            <HelloDemo />
          </div>
        </div>
      </main>
    </div>
  )
}
