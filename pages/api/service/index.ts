import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getSession } from 'next-auth/react'

// POST /api/service
// Required fields in body: name, endpoint, displayPriority, authorId
// Optional fields in body: description, auth_login, auth_password
// GET /api/service
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    name,
    description,
    endpoint,
    auth_login,
    auth_password,
    displayPriority,
  } = req.body
  const session = await getSession({ req })
  
  // POST
  if (req.method === "POST") {
    if (session) {
      try {
        const newService = await prisma.service.create({
          data: {
            name: name,
            description: description,
            endpoint: endpoint,
            auth_login: auth_login,
            auth_password: auth_password,
            displayPriority: displayPriority,
            author: { connect: { email: session?.user?.email } },
            status: { create: { code: 0, message: '' } }
          },
        })
        res.json(newService)
      } catch (error) {
        console.log(error.message)
      }
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  // GET
  } else if (req.method === "GET") {
    try {
      const serviceList = await prisma.service.findMany({
        where: {
          published: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
          endpoint: true,
          auth_login: true,
          auth_password: true,
          displayPriority: true,
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          status: {
            select: {
              id: true,
              code: true,
              message: true,
            },
          },
        },
        orderBy: {
          displayPriority: 'asc',
        },
      })
      res.json(serviceList)
    } catch (error) {
      console.log(error.message)
    }
  } else {
    throw new Error(`The ${req.method} method is not supported at this route.`)
  }
}
