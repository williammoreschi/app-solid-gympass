import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use.case'

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const registerCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })
  const registerBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = registerBodySchema.parse(request.body)
  const { gymId } = registerCheckInParamsSchema.parse(request.body)

  const registerUseCase = makeCheckInUseCase()
  await registerUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}
