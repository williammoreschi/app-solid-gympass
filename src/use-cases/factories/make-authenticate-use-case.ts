import { PrismaUsersRepository } from '@/repositories/prisma/prismas-users-repository'
import { AuthenticateUserCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const userRespositry = new PrismaUsersRepository()
  const authenticateUseCase = new AuthenticateUserCase(userRespositry)

  return authenticateUseCase
}
