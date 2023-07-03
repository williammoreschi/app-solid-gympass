import { PrismaUsersRepository } from '@/repositories/prisma/prismas-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const userRespositry = new PrismaUsersRepository()
  const useCase = new AuthenticateUseCase(userRespositry)

  return useCase
}
