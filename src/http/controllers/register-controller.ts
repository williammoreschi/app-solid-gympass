import { FastifyRequest, FastifyReply } from 'fastify'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  const userWhithSameEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (userWhithSameEmail) {
    return reply.status(409).send()
  }

  const password_hash = await hash(password, 6)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })

  return reply.status(201).send()
}
