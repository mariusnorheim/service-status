import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../../../lib/prisma'

function convertToBoolean(input: string): boolean | undefined {
  try {
    return JSON.parse(input.toLowerCase())
  } catch (e) {
    return undefined
  }
}

// PUT /api/publish/service/[id]/[published]
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id
  const reqValue = req.query.published as string
  const publishedValue = convertToBoolean(reqValue)
  const session = await getSession({ req })

  if (session) {
    if (publishedValue != undefined) {
      const service = await prisma.service.update({
        where: { id: Number(id) },
        data: { published: publishedValue },
      })
      res.json(service)
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}
