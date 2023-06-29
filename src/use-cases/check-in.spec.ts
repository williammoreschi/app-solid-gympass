import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGmysRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let checkInRepository: InMemoryCheckInsRepository
let gymsInRepository: InMemoryGmysRepository
let sut: CheckInUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsInRepository = new InMemoryGmysRepository()
    sut = new CheckInUseCase(checkInRepository, gymsInRepository)

    gymsInRepository.itens.push({
      id: 'gym-01',
      title: 'Gym Smart',
      description: '',
      phone: '',
      latitude: new Decimal(-23.4231851),
      longitude: new Decimal(-51.9262769),
      created_at: new Date(),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.4231851,
      userLognitude: -51.9262769,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 5, 28, 16, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.4231851,
      userLognitude: -51.9262769,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -23.4231851,
        userLognitude: -51.9262769,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in in different day', async () => {
    vi.setSystemTime(new Date(2023, 5, 28, 16, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.4231851,
      userLognitude: -51.9262769,
    })

    vi.setSystemTime(new Date(2023, 5, 29, 16, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.4231851,
      userLognitude: -51.9262769,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distance gym', async () => {
    gymsInRepository.itens.push({
      id: 'gym-02',
      title: 'Gym Number ONE',
      description: '',
      phone: '',
      latitude: new Decimal(-23.405424),
      longitude: new Decimal(-51.8712165),
      created_at: new Date(),
    })
    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -23.4231851,
        userLognitude: -51.9262769,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
