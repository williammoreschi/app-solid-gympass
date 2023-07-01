import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMeticsUseCaseRequet {
  userId: string
}

interface GetUserMeticsUseCaseResponse {
  checkInsCount: number
}

export class GetUserMeticsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMeticsUseCaseRequet): Promise<GetUserMeticsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return { checkInsCount }
  }
}
