import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { PrismaUsersRepository } from '@/repositories/prismas-users-repository'

interface RegisterParams {
  name: string
  email: string
  password: string
}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterParams) {
  const password_hash = await hash(password, 6)

  const userWhithSameEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (userWhithSameEmail) {
    throw new Error('E-mail already exists')
  }

  const prinmaUserRepository = new PrismaUsersRepository()

  await prinmaUserRepository.create({ name, email, password_hash })
}
