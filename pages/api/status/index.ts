import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getSession } from 'next-auth/react'

// POST /api/status
// Required fields in body: message, code, serviceId
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    message,
    code,
    serviceId,
  } = req.body
  const session = await getSession({ req })

  if (req.method === "POST") {
    if (session) {
      try {
        const newStatus = await prisma.status.create({
          data: {
            message: message,
            code: code,
            service: { connect: { id: serviceId } },
          },
        })
        res.json(newStatus)
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
