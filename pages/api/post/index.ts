import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getSession } from 'next-auth/react'

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { title, content, serviceId } = req.body;
  const session = await getSession({ req });
  
  // POST
  if (req.method === "POST") {
    if (session) {
      // Has serviceId
      if (typeof(serviceId) === "number") {
        try {
          const newPost = await prisma.post.create({
            data: {
              title: title,
              content: content,
              author: { connect: { email: session?.user?.email } },
              service: { connect: { id: serviceId } },
            },
          });
          res.json(newPost);
        } catch (error) {
          console.log(error.message)
        }
      // No serviceId
      } else {
        try {
          const newPost = await prisma.post.create({
            data: {
              title: title,
              content: content,
              author: { connect: { email: session?.user?.email } },
            },
          })
          res.json(newPost)
        } catch (error) {
          console.log(error.message)
        }
      }
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  // GET
  } else if (req.method === "GET") {
    try {
      const postList = await prisma.post.findMany({
        where: {
          published: true,
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
      res.json(postList)
      } catch (error) {
        console.log(error.message)
    }
  } else {
    throw new Error(`The ${req.method} method is not supported at this route.`)
  }
}
