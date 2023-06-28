import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it } from 'vitest'
import { AuthenticateUserCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { hash } from 'bcryptjs'

describe('Authenticate Use Case', async () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUSeCase = new AuthenticateUserCase(usersRepository)

    const email = 'jonh.doe@example.com'

    await usersRepository.create({
      name: 'Jonh Doe',
      email,
      password_hash: await hash('123456', 6),
    })

    const { user } = await authenticateUSeCase.execute({
      email,
      password: '123456',
    })

    expect(user.email).toEqual(email)
  })
  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUSeCase = new AuthenticateUserCase(usersRepository)

    await expect(() =>
      authenticateUSeCase.execute({
        email: 'jonh.doe@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUSeCase = new AuthenticateUserCase(usersRepository)

    await usersRepository.create({
      name: 'Jonh Doe',
      email: 'jonh.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      authenticateUSeCase.execute({
        email: 'jonh.doe@example.com',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
