import gql from 'graphql-tag'

export const EthersQuery = gql`
  query ethers {
    ethers @client {
      ethers
    }
  }
`

export const MyProfile = gql`
query getMyProfile {
  myProfile {
    # if legal agreements not accepted then profile not created!
    legal
  }
}
`

export const PartyQuery = gql`
  query getParty($address: String) {
    party(address: $address) @client {
      # hardcoded in events.json
      description
      date
      location
      # from resolver
      address
      # From Contract
      owner
      name
      attendees
      deposit
      limitOfParticipants
      registered
      attended
      ended
      cancelled
      endedAt
      coolingPeriod
      payoutAmount
      encryption
      participants {
        participantName
        address
        attended
        paid
      }
    }
  }
`

export const AllPartiesQuery = gql`
  query getParties {
    parties: activeParties @auth {
      name
      address
      description
      date
      location
      deposit
      coolingPeriod
      attendeeLimit
      attendees
      owner
      admins
    }
  }
`

export const AllEventsQuery = gql`
  query getEvents {
    events @client {
      name
      address
    }
  }
`

export const GET_MARKED_ATTENDED_SINGLE = gql`
  query getMarkedAttendedSingle($contractAddress: String) {
    markAttendedSingle(contractAddress: $contractAddress) @client
  }
`

export const GET_MARKED_ATTENDED = gql`
  query getMarkedAttended {
    markedAttendedList @client
  }
`
