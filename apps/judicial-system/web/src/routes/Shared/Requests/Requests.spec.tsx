import '@testing-library/jest-dom'

import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'

import { CaseState } from '@island.is/judicial-system/types'
import {
  mockJudgeQuery,
  mockProsecutorQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import { CasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import Requests from './Requests'

const mockCasesQuery = [
  {
    request: {
      query: CasesQuery,
    },
    result: {
      data: {
        cases: [
          {
            id: 'test_id_1',
            modified: '2020-09-16T19:51:39.466Z',
            created: '2020-09-16T19:50:08.033Z',
            state: CaseState.DRAFT,
            policeCaseNumber: 'string',
            accusedNationalId: 'string',
            accusedName: 'Jon Harring Sr.',
            validToDate: null,
            parentCase: {
              id: '1337',
            },
          },
          {
            id: 'test_id_2',
            created: '2020-12-16T19:50:08.033Z',
            modified: '2020-12-16T19:51:39.466Z',
            state: CaseState.DRAFT,
            policeCaseNumber: 'string',
            accusedNationalId: 'string',
            accusedName: 'Jon Harring',
            validToDate: null,
          },
          {
            id: 'test_id_3',
            created: '2020-05-16T19:50:08.033Z',
            modified: '2020-09-16T19:51:39.466Z',
            state: CaseState.ACCEPTED,
            policeCaseNumber: '008-2020-X',
            accusedNationalId: '012345-6789',
            accusedName: 'Mikki Refur',
            validToDate: '2020-11-11T12:31:00.000Z',
          },
          {
            id: 'test_id_4',
            created: '2020-08-16T19:50:08.033Z',
            modified: '2020-09-16T19:51:39.466Z',
            state: CaseState.NEW,
            policeCaseNumber: '008-2020-X',
            accusedNationalId: '012345-6789',
            accusedName: 'Erlingur L Kristinsson',
            validToDate: '2020-11-11T12:31:00.000Z',
          },
          {
            id: 'test_id_5',
            created: '2020-08-16T19:50:08.033Z',
            modified: '2020-09-16T19:51:39.466Z',
            state: CaseState.DELETED,
            policeCaseNumber: '008-2020-X',
            accusedNationalId: '012345-6789',
            accusedName: 'Erlingur L Kristinsson',
            validToDate: '2020-11-11T12:31:00.000Z',
          },
          {
            id: 'test_id_6',
            created: '2021-01-16T19:50:08.033Z',
            modified: '2021-01-16T19:51:39.466Z',
            state: CaseState.RECEIVED,
            policeCaseNumber: '008-2020-X',
            accusedNationalId: '012345-6789',
            accusedName: 'D. M. Kil',
            validToDate: '2020-11-11T12:31:00.000Z',
          },
          {
            id: 'test_id_7',
            created: '2021-02-16T19:50:08.033Z',
            modified: '2021-02-16T19:51:39.466Z',
            state: CaseState.SUBMITTED,
            policeCaseNumber: '008-2020-X',
            accusedNationalId: '012345-6789',
            accusedName: 'Moe',
            validToDate: '2020-11-11T12:31:00.000Z',
          },
        ],
      },
    },
  },
]

describe('Custody petitions route', () => {
  test('should list all cases that do not have status NEW, DELETED, ACCEPTED or REJECTED in a active cases table if you are a judge', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockJudgeQuery]}
        addTypename={false}
      >
        <UserProvider authenticated={true}>
          <Requests />
        </UserProvider>
      </MockedProvider>,
    )

    expect(
      await waitFor(
        () => screen.getAllByTestId('custody-requests-table-row').length,
      ),
    ).toEqual(4)
  })

  test('should display the judge logo if you are a judge', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockJudgeQuery]}
        addTypename={false}
      >
        <UserProvider authenticated={true}>
          <Requests />
        </UserProvider>
      </MockedProvider>,
    )

    expect(
      await screen.findByText('Héraðsdómur Reykjavíkur'),
    ).toBeInTheDocument()
  })

  test('should not display a button to create a request if the user is a judge', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockJudgeQuery]}
        addTypename={false}
      >
        <UserProvider>
          <Requests />
        </UserProvider>
      </MockedProvider>,
    )

    expect(
      await waitFor(() =>
        screen.queryByRole('button', { name: /Stofna nýja kröfu/i }),
      ),
    ).not.toBeInTheDocument()
  })

  test('should not display a button to delete a request if the user is a judge', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockJudgeQuery]}
        addTypename={false}
      >
        <UserProvider>
          <Requests />
        </UserProvider>
      </MockedProvider>,
    )

    expect(
      await waitFor(() => screen.queryByLabelText('Viltu eyða drögum?')),
    ).not.toBeInTheDocument()
  })

  test('should not display a buttton to delete a request that do not have a NEW or DRAFT or SUBMITTED or RECEIVED state', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <UserProvider authenticated={true}>
          <Requests />
        </UserProvider>
      </MockedProvider>,
    )

    expect(
      await waitFor(
        () => screen.getAllByLabelText('Viltu afturkalla kröfu?').length,
      ),
    ).toEqual(5)
  })

  test('should not show deleted or past requests', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <UserProvider authenticated={true}>
          <Requests />
        </UserProvider>
      </MockedProvider>,
    )

    expect(
      await waitFor(
        () => screen.getAllByTestId('custody-requests-table-row').length,
      ),
    ).toEqual(5)
  })

  test('should display the prosecutor logo if you are a prosecutor', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <UserProvider authenticated={true}>
          <Requests />
        </UserProvider>
      </MockedProvider>,
    )

    expect(
      await screen.findByText('Lögreglustjórinn á höfuðborgarsvæðinu'),
    ).toBeInTheDocument()
  })

  test('should list all active cases in a list if you are a prosecutor', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <UserProvider authenticated={true}>
          <Requests />
        </UserProvider>
      </MockedProvider>,
    )

    expect(
      (await screen.findAllByTestId('custody-requests-table-row')).length,
    ).toEqual(5)
  })

  test('should order the table data by accused name in ascending order when the user clicks the accused name table header', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <UserProvider authenticated={true}>
          <Requests />
        </UserProvider>
      </MockedProvider>,
    )

    userEvent.click(await screen.findByTestId('accusedNameSortButton'))

    const tableRows = await screen.findAllByTestId('custody-requests-table-row')

    expect(tableRows[0]).toHaveTextContent('D. M. Kil')
    expect(tableRows[1]).toHaveTextContent('Erlingur L Kristinsson')
    expect(tableRows[2]).toHaveTextContent('Jon Harring')
    expect(tableRows[3]).toHaveTextContent('Jon Harring Sr.')
    expect(tableRows[4]).toHaveTextContent('Moe')
  })

  test('should order the table data by accused name in descending order when the user clicks the accused name table header twice', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <UserProvider authenticated={true}>
          <Requests />
        </UserProvider>
      </MockedProvider>,
    )

    userEvent.dblClick(await screen.findByTestId('accusedNameSortButton'))

    const tableRows = await screen.findAllByTestId('custody-requests-table-row')

    expect(tableRows[4]).toHaveTextContent('D. M. Kil')
    expect(tableRows[3]).toHaveTextContent('Erlingur L Kristinsson')
    expect(tableRows[2]).toHaveTextContent('Jon Harring')
    expect(tableRows[1]).toHaveTextContent('Jon Harring Sr.')
    expect(tableRows[0]).toHaveTextContent('Moe')
  })

  test('should order the table data by created in ascending order when the user clicks the created table header', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <UserProvider authenticated={true}>
          <Requests />
        </UserProvider>
      </MockedProvider>,
    )

    userEvent.click(await screen.findByText('Krafa stofnuð'))

    const tableRows = await screen.findAllByTestId('custody-requests-table-row')

    expect(tableRows[0]).toHaveTextContent('Erlingur L Kristinsson')
    expect(tableRows[1]).toHaveTextContent('Jon Harring Sr.')
    expect(tableRows[2]).toHaveTextContent('Jon Harring')
    expect(tableRows[3]).toHaveTextContent('D. M. Kil')
    expect(tableRows[4]).toHaveTextContent('Moe')
  })

  test('should order the table data by created in descending order when the user clicks the created table header twice', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <UserProvider authenticated={true}>
          <Requests />
        </UserProvider>
      </MockedProvider>,
    )

    userEvent.dblClick(await screen.findByText('Krafa stofnuð'))

    const tableRows = await screen.findAllByTestId('custody-requests-table-row')

    expect(tableRows[4]).toHaveTextContent('Erlingur L Kristinsson')
    expect(tableRows[3]).toHaveTextContent('Jon Harring Sr.')
    expect(tableRows[2]).toHaveTextContent('Jon Harring')
    expect(tableRows[1]).toHaveTextContent('D. M. Kil')
    expect(tableRows[0]).toHaveTextContent('Moe')
  })

  test('should display an error alert if the api call fails', async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: CasesQuery,
            },
            error: { name: 'error', message: 'message' },
          },
          ...mockProsecutorQuery,
        ]}
        addTypename={false}
      >
        <UserProvider>
          <Requests />
        </UserProvider>
      </MockedProvider>,
    )

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(
      await screen.findByText(
        'Ekki tókst að ná sambandi við gagnagrunn. Málið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar.',
      ),
    ).toBeInTheDocument()
  })
})
