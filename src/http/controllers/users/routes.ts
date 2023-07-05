import { FastifyInstance } from 'fastify'
import { register } from './register-controller'
import { authenticate } from './authenticate-controller'
import { profile } from './profile'
import { verifyJWT } from '@/http/middlewares/vefiry-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
