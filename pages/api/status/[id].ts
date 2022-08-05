import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

// PUT /api/status/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id
  const { code, message } = req.body

  if (req.method === "PUT") {
    try {
      const updateStatus = await prisma.status.update({
        where: { id: Number(id) },
        data: { 
          code: code,
          message: message,
          },
      })
      res.json(updateStatus); 
    } catch (error) {
      console.log(error.message)
    }
  } else {
    throw new Error(`The ${req.method} method is not supported at this route.`)
  }
}
