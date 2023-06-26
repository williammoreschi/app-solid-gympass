import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Jonh Doe',
      email: 'jonh.doe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

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

  it('should not be able to register with same email repeatedly ', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'jonh.doe@example.com'

    await registerUseCase.execute({
      name: 'Jonh Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'Jonh Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
