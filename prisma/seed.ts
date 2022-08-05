import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@test.no',
    posts: {
      create: [
        {
          title: 'Join our Slack!',
          content: 'https://www.slack.com',
          published: true,
        },
      ],
    },
  },
  {
    name: 'Bob',
    email: 'bob@test.no',
    posts: {
      create: [
        {
          title: 'Follow our Facebook!',
          content: 'https://www.facebook.com/',
          published: true,
        },
      ],
    },
  },
  {
    name: 'Mohamed',
    email: 'mohamed@test.no',
    posts: {
      create: [
        {
          title: 'Ask a question on GitLab!',
          content: 'https://www.gitlab.com',
          published: true,
        },
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
