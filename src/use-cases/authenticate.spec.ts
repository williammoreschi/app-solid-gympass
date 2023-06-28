import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateUserCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { hash } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUserCase

describe('Authenticate Use Case', async () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUserCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const email = 'jonh.doe@example.com'

    await usersRepository.create({
      name: 'Jonh Doe',
      email,
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email,
      password: '123456',
    })

    expect(user.email).toEqual(email)
  })
  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'jonh.doe@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Jonh Doe',
      email: 'jonh.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'jonh.doe@example.com',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
