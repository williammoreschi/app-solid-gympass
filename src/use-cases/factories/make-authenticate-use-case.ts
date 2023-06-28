import { PrismaUsersRepository } from '@/repositories/prisma/prismas-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const userRespositry = new PrismaUsersRepository()
  const authenticateUseCase = new AuthenticateUseCase(userRespositry)

  return authenticateUseCase
}
