import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getSession } from 'next-auth/react'

// GET /api/post/unpublished
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  
  if (req.method === "GET") {
    if (session) {
        try {
          const postList = await prisma.post.findMany({
            where: {
              published: false,
            },
            include: {
              author: {
                select: {
                  name: true,
                },
              },
              service: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              id: 'desc',
            },
          })
          res.json(postList);
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
