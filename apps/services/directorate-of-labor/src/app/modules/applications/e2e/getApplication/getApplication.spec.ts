import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Application } from '../../models/application.model'
import { applicationResponse } from '../testHelpers'
import { setup } from '../../../../../../test/setup'
import { errorResponse } from '../../../../../../test/globalTestHelpers'

describe('getApplication', () => {
  let app: INestApplication
  beforeAll(async () => {
    // create the nestjs test app
    app = await setup()
  })

  it(`GET /v1/applications/:applicationId should return not found on non existing applications`, async () => {
    const response: { body: Application[] } = await request(app.getHttpServer())
      .get('/v1/applications/a353d810-15eb-442f-b481-3eacba289e9a')
      .send()
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorResponse,
      statusCode: 404,
      message: "This resource doesn't exist",
    })
  })

  it(`GET /v1/applications/:applicationId should return an application`, async () => {
    const response: { body: Application[] } = await request(app.getHttpServer())
      .get('/v1/applications/a353d810-15eb-442f-b481-3eacba289e1a')
      .send()
      .expect(200)

    expect(response.body).toMatchObject(applicationResponse)
  })
})
