import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getSession } from 'next-auth/react'

// GET /api/service/unpublished
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  // GET
  if (req.method === "GET") {
      if (session) {
        try {
          const serviceList = await prisma.service.findMany({
            where: {
              published: false,
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
              id: 'desc',
            },
          })
          res.json(serviceList)
        } catch (error) {
          console.log(error.message)
        }
      } else {
        res.status(401).send({ message: 'Unauthorized' })
      }
  } else {
    throw new Error(`The ${req.method} method is not supported at this route.`)
  }
}