import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma'

// DELETE /api/service/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;
  const session = await getSession({ req })

  if (req.method === "DELETE") {
    if (session) {
      try {
        const deleteService = await prisma.service.delete({
          where: { id: Number(id) },
        });
        res.json(deleteService);
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
