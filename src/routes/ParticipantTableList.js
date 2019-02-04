import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'react-emotion'

import { amAdmin, getMyParticipantEntry } from '../utils/parties'
import { PartyAdminViewQuery } from '../graphql/queries'

import { Table, Tbody, TH, TR, TD } from '../components/Table'
import Button from '../components/Forms/Button'
import ErrorBox from '../components/ErrorBox'
import SafeQuery from '../components/SafeQuery'
import EventFilters from '../components/SingleEvent/EventFilters'
import { GlobalConsumer } from '../GlobalState'
import mq from '../mediaQuery'

const SingleEventContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto 0;
  flex-direction: column;
  ${mq.medium`
    flex-direction: row;
  `};
`

const NoParticipants = styled('div')``

const TableList = styled('div')`
  display: flex;
  flex-direction: column;
`

const DownloadButton = styled(Button)`
  margin-bottom: 20px;
`

const cells = [
  { label: 'Real Name', value: 'user.realName' },
  { label: 'Address', value: 'user.address' },
  { label: 'Email', value: 'user.email' },
  { label: 'Status', value: 'status' }
]

function getEmail(email) {
  if (email === null) {
    return null
  }

  if (email.verified) {
    return email.verified
  } else if (email.pending) {
    return email.pending
  } else {
    return null
  }
}

class SingleEventWrapper extends Component {
  state = {
    search: ''
  }

  handleSearch = value => {
    this.setState({
      search: value
    })
  }

  downloadCSV(csv, filename) {
    let csvFile
    let downloadLink

    // CSV FILE
    csvFile = new Blob([csv], { type: 'text/csv' })

    // Download link
    downloadLink = document.createElement('a')

    // File name
    downloadLink.download = filename

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile)

    // Make sure that the link is not displayed
    downloadLink.style.display = 'none'

    // Add the link to your DOM
    document.body.appendChild(downloadLink)

    // Lanzamos
    downloadLink.click()
  }

  exportTableToCSV(html, filename) {
    var csv = []
    var rows = document.querySelectorAll('table tr')

    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll('td, th')

      for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText)

      csv.push(row.join(','))
    }

    // Download CSV
    this.downloadCSV(csv.join('\n'), filename)
  }

  render() {
    const { search } = this.state
    const { handleSearch } = this
    const { address } = this.props.match.params

    return (
      <SingleEventContainer>
        <GlobalConsumer>
          {({ userAddress }) => (
            <SafeQuery
              query={PartyAdminViewQuery}
              variables={{ address }}
              fetchPolicy="cache-and-network"
              pollInterval={60000}
            >
              {({ data: { partyAdminView: party }, loading, error }) => {
                // no party?
                if (!party) {
                  if (loading) {
                    return 'Loading ...'
                  } else {
                    return (
                      <ErrorBox>
                        We could not find an event at the address {address}!
                      </ErrorBox>
                    )
                  }
                }
                const { participants } = party

                // pre-calculate some stuff up here
                const preCalculatedProps = {
                  amAdmin: amAdmin(party, userAddress),
                  myParticipantEntry: getMyParticipantEntry(party, userAddress)
                }

                preCalculatedProps.amAdmin = amAdmin(party, userAddress)

                return (
                  <TableList>
                    <DownloadButton
                      onClick={() => {
                        const html = document.querySelector('table').outerHTML
                        this.exportTableToCSV(html, 'event.csv')
                      }}
                    >
                      Download as CSV
                    </DownloadButton>
                    <EventFilters handleSearch={handleSearch} />
                    <Table>
                      <Tbody>
                        <TR>
                          {cells.map(cell => (
                            <TH>{cell.label}</TH>
                          ))}
                          <TH>GDPR</TH>
                          <TH>Marketing</TH>
                        </TR>

                        {participants.length > 0 ? (
                          participants
                            .sort((a, b) => (a.index < b.index ? -1 : 1))
                            .filter(
                              p =>
                                (p.user.address || '')
                                  .toLowerCase()
                                  .includes(search) ||
                                (p.user.realName || '')
                                  .toLowerCase()
                                  .includes(search) ||
                                (p.user.username || '')
                                  .toLowerCase()
                                  .includes(search)
                            )
                            .map(participant => (
                              <>
                                <TR />
                                <TR>
                                  {cells.map(cell => {
                                    if (cell.label === 'Email') {
                                      return (
                                        <TD>
                                          {getEmail(participant.user.email)}
                                        </TD>
                                      )
                                    }
                                    return (
                                      <TD>{_.get(participant, cell.value)}</TD>
                                    )
                                  })}
                                  <TD>
                                    {participant.user.legal &&
                                    participant.user.legal[0] &&
                                    participant.user.legal[0].accepted
                                      ? 'accepted'
                                      : 'denied'}
                                  </TD>
                                  <TD>
                                    {participant.user.legal &&
                                    participant.user.legal[2] &&
                                    participant.user.legal[2].accepted
                                      ? 'accepted'
                                      : 'denied'}
                                  </TD>
                                </TR>
                              </>
                            ))
                        ) : (
                          <NoParticipants>No one is attending.</NoParticipants>
                        )}
                      </Tbody>
                    </Table>
                  </TableList>
                )
              }}
            </SafeQuery>
          )}
        </GlobalConsumer>
      </SingleEventContainer>
    )
  }
}

export default SingleEventWrapper
