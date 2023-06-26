import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

describe('Register Use Case', () => {
  it('should hash user upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Jonh Doe',
      email: 'jonh.doe@example.com',
      password: '123456',
    })

    const isPassworCorrectlyHashed = await compare('123456', user.password_hash)

    expect(isPassworCorrectlyHashed).toBe(true)
  })
})
