import React, { Component } from 'react'
import styled from 'react-emotion'
import ReverseResolution from '../ReverseResolution'
import { winningShare } from './utils'

const TwitterAvatar = styled('img')`
  border-radius: 50%;
  width: 50px;
`

const ParticipantAddress = styled('div')``

const WinningShare = styled('div')``

class Participant extends Component {
  render() {
    const { participant, party } = this.props
    const { participantName, address, paid, attended } = participant
    const { registered, attended: attendedCount, deposit, ended } = party

    return (
      <ParticipantContainer>
        <div>{participantName}</div>
        <TwitterAvatar
          src={`https://avatars.io/twitter/${participantName}/medium`}
        />
        <ParticipantAddress>
          <ReverseResolution address={address} />
        </ParticipantAddress>

        {ended && (
          <WinningShare>
            {attended
              ? `won ${winningShare(
                  deposit,
                  registered,
                  attendedCount
                )} ${paid && 'and withdrawn'}`
              : `lost ${deposit}`}
          </WinningShare>
        )}
      </ParticipantContainer>
    )
  }
}

const ParticipantContainer = styled('div')``

export default Participant
