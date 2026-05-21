import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const count = await prisma.promotion.count()
  console.log(`Current promotion count: ${count}`)
  
  const allPromos = await prisma.promotion.findMany({
    orderBy: { createdAt: 'asc' }
  })
  
  if (allPromos.length > 2) {
    const toDelete = allPromos.slice(2)
    const ids = toDelete.map(p => p.id)
    
    await prisma.promotion.deleteMany({
      where: {
        id: { in: ids }
      }
    })
    
    console.log(`Deleted ${ids.length} promotions. Left 2.`)
  } else {
    console.log('Already have 2 or fewer promotions.')
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
