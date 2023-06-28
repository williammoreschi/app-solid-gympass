import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })
  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Jonh Doe',
      email: 'jonh.doe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Jonh Doe',
      email: 'jonh.doe@example.com',
      password: '123456',
    })

    const isPassworCorrectlyHashed = await compare('123456', user.password_hash)

    expect(isPassworCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email repeatedly ', async () => {
    const email = 'jonh.doe@example.com'

    await sut.execute({
      name: 'Jonh Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'Jonh Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
