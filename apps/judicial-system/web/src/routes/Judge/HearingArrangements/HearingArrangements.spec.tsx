import React from 'react'
import { render, waitFor, screen, within } from '@testing-library/react'
import { HearingArrangements } from './HearingArrangements'
import { UpdateCase } from '@island.is/judicial-system/types'
import userEvent from '@testing-library/user-event'
import {
  mockCaseQueries,
  mockJudgeUserContext,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import { MemoryRouter, Route } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing'
import * as Constants from '../../../utils/constants'

describe('/domari-krafa/fyrirtokutimi', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange

    // Act and Assert
    render(
      <MockedProvider
        mocks={mockCaseQueries.concat(
          mockUpdateCaseMutation([
            {
              id: 'test_id_2',
              courtDate: '2020-09-12',
            } as UpdateCase,
            {
              id: 'test_id_2',
              courtDate: '2020-09-12T14:51:00.000Z',
            } as UpdateCase,
            {
              id: 'test_id_2',
              courtRoom: '999',
            } as UpdateCase,
          ]),
        )}
        addTypename={false}
      >
        <userContext.Provider value={mockJudgeUserContext}>
          <MemoryRouter
            initialEntries={[
              `${Constants.HEARING_ARRANGEMENTS_ROUTE}/test_id_2`,
            ]}
          >
            <Route path={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/:id`}>
              <HearingArrangements />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    // No need to enter court date and time, because that should be prefilled with requestedCourtDate

    userEvent.type(
      await waitFor(() => screen.getByLabelText('Dómsalur *')),
      '999',
    )

    userEvent.tab()

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).not.toBeDisabled()
  })

  test('should have a prefilled court date with requested court date', async () => {
    // Arrange
    render(
      <MockedProvider
        mocks={mockCaseQueries.concat(
          mockUpdateCaseMutation([
            {
              id: 'test_id_3',
              courtDate: '2020-09-16',
            } as UpdateCase,
            {
              id: 'test_id_3',
              courtDate: '2020-09-16T19:51:00.000Z',
            } as UpdateCase,
          ]),
        )}
        addTypename={false}
      >
        <userContext.Provider value={mockJudgeUserContext}>
          <MemoryRouter
            initialEntries={[
              `${Constants.HEARING_ARRANGEMENTS_ROUTE}/test_id_3`,
            ]}
          >
            <Route path={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/:id`}>
              <HearingArrangements />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    // Act

    // Assert
    expect(
      await waitFor(
        () =>
          (screen.getByLabelText('Veldu dagsetningu *') as HTMLInputElement)
            .value,
      ),
    ).toEqual('16.09.2020')

    expect(
      (screen.getByLabelText('Tímasetning *') as HTMLInputElement).value,
    ).toEqual('19:51')
  })
})