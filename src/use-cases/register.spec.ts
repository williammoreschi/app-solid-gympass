import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'

describe('Register Use Case', () => {
  it('should hash user upon registration', async () => {
    const registerUseCase = new RegisterUseCase({
      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
      async findByEmail(email) {
        return null
      },
    })

    const { user } = await registerUseCase.execute({
      name: 'Jonh Doe',
      email: 'jonh.doe@example.com',
      password: '123456',
    })

    const isPassworCorrectlyHashed = await compare('123456', user.password_hash)

    expect(isPassworCorrectlyHashed).toBe(true)
  })
})
