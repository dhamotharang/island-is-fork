import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import type { Logger } from '@island.is/logging'
import { SubmitApplicationDto } from './dto/submitApplication.input'
import { UnemploymentRegistryClient } from '@island.is/clients/unemployment-registry-v1'

@Injectable()
export class UnemploymentService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private unemploymentRegistryClient: UnemploymentRegistryClient,
  ) {}

  private async handleError(error: any): Promise<never> {
    this.logger.error(JSON.stringify(error))

    if (error.json) {
      const json = await error.json()
      this.logger.error(json)
      throw new ApolloError(JSON.stringify(json), error.status)
    }

    throw new ApolloError('Failed to resolve request', error.status)
  }

  // TODO: Handle auth here
  submitApplication(application: SubmitApplicationDto) {
    this.logger.info('Getting request', application)
    // TODO: Send to VMST here
    // TODO: Handle error response here
    return this.unemploymentRegistryClient.submitApplication(application)
  }
}
