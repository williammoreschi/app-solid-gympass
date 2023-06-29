import { Gym } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGmysRepository implements GymsRepository {
  public itens: Gym[] = []

  async findById(id: string) {
    const gym = this.itens.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }
}
