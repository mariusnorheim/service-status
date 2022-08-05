import { listenerCount } from 'process'
import prisma from '../lib/prisma'

export default async function main() {
  const service = await prisma.service.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  let list: [number, string]
  for (const s of service) {
    list.push(`{service.id}`, `{service.name}`)
  }
}

export enum serviceList {}
// for (var i = 0;i < list.length) {
//   {service.name}
// }
