import { PrismaUsersRepository } from '@/repositories/prisma/prismas-users-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
  const userRespositry = new PrismaUsersRepository()
  const useCase = new RegisterUseCase(userRespositry)

  return useCase
}
