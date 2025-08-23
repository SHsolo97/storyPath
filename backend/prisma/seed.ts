import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Upsert a dev user
  const user = await prisma.user.upsert({
    where: { id: 'user_dev_1' },
    update: {},
    create: { id: 'user_dev_1' }
  })

  // Seed a sample story and chapter (align with content service sample if applicable)
  await prisma.story.upsert({
    where: { id: 'sample-story' },
    update: {},
    create: {
      id: 'sample-story',
      title: 'Sample Story',
      description: 'Seeded sample for development',
      cover: null,
      genres: ['adventure'],
      ageRating: 'PG',
      premiumModel: 'free',
      version: '1.0.0',
      chapters: {
        create: [
          {
            id: 'ch-1',
            idx: 1,
            title: 'Chapter 1',
            premium: false,
            assets: []
          }
        ]
      }
    }
  })

  // Seed an example save
  await prisma.save.create({
    data: {
      userId: user.id,
      storyId: 'sample-story',
      chapterId: 'ch-1',
      nodeId: 'n-1',
      variables: { hp: 10 }
    }
  })

  console.log('Seed complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
