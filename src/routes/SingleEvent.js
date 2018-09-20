import React, { Component } from 'react'
import styled from 'react-emotion'
import { Query } from 'react-apollo'
import { PartyQuery } from '../graphql/queries'
import Loader from '../components/Loader'
import SetLimit from '../components/SingleEvent/SetLimit'
import EventInfo from '../components/SingleEvent/EventInfo'
import EventCTA from '../components/SingleEvent/EventCTA'
import EventFilters from '../components/SingleEvent/EventFilters'
import EventParticipants from '../components/SingleEvent/EventParticipants'

const SingleEventContainer = styled('div')``

class SingleEvent extends Component {
  state = {
    search: ''
  }

  handleSearch = event => {
    this.setState({
      search: event.target.value
    })
  }

  render() {
    const { address } = this.props.match.params
    return (
      <SingleEventContainer>
        <Query query={PartyQuery} variables={{ address }}>
          {({ data: { party }, loading }) => {
            if (loading) {
              return <Loader />
            }
            return (
              <div>
                <EventInfo party={party} address={address} />
                <EventCTA party={party} address={address} />
                <EventFilters handleSearch={this.handleSearch} />
                <EventParticipants
                  search={this.state.search}
                  party={party}
                  participants={party.participants}
                />
                <SetLimit address={address} />
                {/* {Object.entries(party).map(arr => {
                  if (arr[0] === 'participants') {
                    return ''
                  }
                  return <div>{`${arr[0]} ${arr[1]}`}</div>
                })} */}
              </div>
            )
          }}
        </Query>
      </SingleEventContainer>
    )
  }
}

export default SingleEvent
