import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const serviceData: Prisma.ServiceCreateInput[] = [
  {
    name: 'Test service 1',
    description: 'This is test service 1!',
    endpoint: 'http://localhost:3000',
    auth_login: '',
    auth_password: '',
    displayPriority: 1,
    published: true,
    author: {
      connect: {
        email: 'xeroxmf@gmail.com',
      },
    },
  },
  {
    name: 'Test service 2',
    description: 'This is test service 2!',
    endpoint: 'https://www.mariusnorheim.dev/',
    auth_login: '',
    auth_password: '',
    displayPriority: 2,
    published: true,
    author: {
      connect: {
        email: 'xeroxmf@gmail.com',
      },
    },
  },
  {
    name: 'Test service 3',
    description: 'This is test service 3!',
    endpoint: 'https://no.bogus',
    auth_login: '',
    auth_password: '',
    displayPriority: 3,
    published: true,
    author: {
      connect: {
        email: 'xeroxmf@gmail.com',
      },
    },
  },
]

const statusData: Prisma.StatusCreateInput[] = [
  {
    code: 200,
    message: 'Test status 1',
    service: {
      connect: {
        id: 1,
      },
    },
  },
  {
    code: 200,
    message: 'Test status 2',
    service: {
      connect: {
        id: 2,
      },
    },
  },
  {
    code: 404,
    message: 'Test status 3',
    service: {
      connect: {
        id: 3,
      },
    },
  },
]

const postData: Prisma.PostCreateInput[] = [
  {
    title: 'Follow me on Twitter!',
    content: 'Hit me up! https://www.twitter.com/elonmusk',
    published: true,
    author: {
      connect: {
        email: 'xeroxmf@gmail.com',
      },
    },
    service: {
      connect: {
        id: 1,
      },
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const ser of serviceData) {
    const service = await prisma.service.create({
      data: ser,
    })
    console.log(`Created service with id: ${service.id}`)
  }
  for (const sta of statusData) {
    const status = await prisma.status.create({
      data: sta,
    })
    console.log(`Created status with id: ${status.id}`)
  }
  for (const p of postData) {
    const post = await prisma.post.create({
      data: p,
    })
    console.log(`Created post with id: ${post.id}`)
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
