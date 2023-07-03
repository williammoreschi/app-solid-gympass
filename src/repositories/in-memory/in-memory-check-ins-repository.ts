import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public itens: CheckIn[] = []

  async findById(id: string) {
    const checkIn = this.itens.find((item) => item.id === id)

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    /**
     * date = 2023-01-01T16:52:58
     * startOf => 2023-01-01T00:00:00
     * endOf => 2023-01-01T23:59:59
     */
    const startOfThetDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.itens.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfThetDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) return null

    return checkInOnSameDate
  }

  async findManyByUserId(userId: string, page: number) {
    return this.itens
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async countByUserId(userId: string) {
    return this.itens.filter((checkIn) => checkIn.user_id === userId).length
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkin = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.itens.push(checkin)

    return checkin
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.itens.findIndex((item) => item.id === checkIn.id)

    if (checkInIndex >= 0) {
      this.itens[checkInIndex] = checkIn
    }

    return checkIn
  }
}
