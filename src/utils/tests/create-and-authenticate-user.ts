import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await request(app.server)
    .post('/users')
    .send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    })

  const Authenticateresponse = await request(app.server)
    .post('/sessions')
    .send({
      email: 'john.doe@example.com',
      password: '123456',
    })

  const token = Authenticateresponse.body.token

  return { token }
}
