import { ApolloConsumer } from 'react-apollo'
import React, { Component } from 'react'
import styled from 'react-emotion'

import { QR_SUPPORTED_QUERY, QR_QUERY } from '../../graphql/queries'

import Button from '../Forms/Button'
import WarningBox from '../WarningBox'
import { Search } from '../Forms/TextInput'
import Label from '../Forms/Label'
import Select from '../Forms/Select'
import { ReactComponent as SearchIcon } from '../svg/Search.svg'
import SafeQuery from '../SafeQuery'

const QRCodeContainer = styled('div')`
  margin-bottom: 20px;
`
const Filter = styled('div')`
  width: 200px;
  margin-bottom: 20px;
`

const EventFiltersContainer = styled('div')``

class EventFilters extends Component {
  state = {}

  _scan = client => () => {
    this.setState({ scanError: null }, async () => {
      try {
        const { error, data = {} } = await client.query({
          query: QR_QUERY,
          fetchPolicy: 'no-cache'
        })

        if (error) {
          throw error
        }

        if (data.qrCode) {
          this.props.handleSearch(data.qrCode)
        }
      } catch (scanError) {
        this.setState({ scanError })
      }
    })
  }

  _onSearch = val => {
    this.props.handleSearch(val)
  }

  render() {
    const {
      search,
      enableQrCodeScanner,
      handleFilterChange,
      amAdmin,
      ended,
      className
    } = this.props
    const { scanError } = this.state

    return (
      <EventFiltersContainer className={className}>
        {amAdmin && !ended && (
          <Filter>
            <Label>Filters</Label>
            <Select
              onChange={handleFilterChange}
              placeholder="Choose"
              options={[
                { label: 'All', value: 'all' },
                {
                  label: 'Not marked attended',
                  value: 'unmarked'
                },
                { label: 'Marked attended', value: 'marked' }
              ]}
            />
          </Filter>
        )}

        <Search
          type="text"
          Icon={SearchIcon}
          onChangeText={this._onSearch}
          value={search}
          placeholder="Search for names or addresses"
          wide
        />
        {enableQrCodeScanner ? (
          <SafeQuery query={QR_SUPPORTED_QUERY}>
            {({ data = {} }) => {
              return data.supported ? (
                <ApolloConsumer>
                  {client => (
                    <QRCodeContainer>
                      <Button onClick={this._scan(client)}>Scan QRCode</Button>
                      {scanError ? (
                        <WarningBox>{`${scanError}`}</WarningBox>
                      ) : null}
                    </QRCodeContainer>
                  )}
                </ApolloConsumer>
              ) : null
            }}
          </SafeQuery>
        ) : null}
      </EventFiltersContainer>
    )
  }
}

export default EventFilters
