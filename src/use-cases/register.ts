import { hash } from 'bcryptjs'

interface RegisterParams {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async execute({ name, email, password }: RegisterParams) {
    const password_hash = await hash(password, 6)

    const userWhithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWhithSameEmail) {
      throw new Error('E-mail already exists')
    }

    await this.usersRepository.create({ name, email, password_hash })
  }
}
