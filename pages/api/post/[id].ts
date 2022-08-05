import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma'

// DELETE /api/post/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;
  const session = await getSession({ req })

  if (req.method === "DELETE") {
    if (session) {
      try {
        const newPost = await prisma.post.delete({
          where: { id: Number(id) },
        });
        res.json(newPost);
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
