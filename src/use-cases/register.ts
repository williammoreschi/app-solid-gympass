import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

interface RegisterParams {
  name: string
  email: string
  password: string
}

interface RegisterUserCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterParams): Promise<RegisterUserCaseResponse> {
    const password_hash = await hash(password, 6)

    const userWhithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWhithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
