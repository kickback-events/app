import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'
import { PARTICIPANT_STATUS, calculateNumAttended } from '@wearekickback/shared'

import DefaultTwitterAvatar from '../User/TwitterAvatar'
import Status from './ParticipantStatus'

import { toEthVal } from '../../utils/units'
import { calculateWinningShare } from '../../utils/parties'
import tick from '../svg/tick.svg'
import Currency from './Currency'
import { GlobalConsumer } from '../../GlobalState'

// import EtherScanLink from '../ExternalLinks/EtherScanLink'

// const ParticipantName = styled('div')`
//   font-size: 12px;
//   font-weight: 700;
//   color: #3d3f50;
//   text-align: center;
// `

const TickContainer = styled('div')`
  width: 12px;
  margin-left: 3px;
`

const Tick = () => (
  <TickContainer>
    <img alt="tick" src={tick} />
  </TickContainer>
)

const ParticipantWrapper = styled(Link)`
  height: ${p => (p.amAdmin ? '170px' : '120px')};
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ParticipantId = styled('div')`
  margin-bottom: 10px;
`

const ParticipantUsername = styled('div')`
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
  color: #3d3f50;
  text-align: center;
`

const TwitterAvatar = styled(DefaultTwitterAvatar)`
  width: 60px;
  height: 60px;
  margin-bottom: 5px;
`

function Participant({ participant, party, amAdmin }) {
  const { user, status } = participant
  const { deposit, ended } = party

  const withdrawn = status === PARTICIPANT_STATUS.WITHDRAWN_PAYOUT
  const attended = status === PARTICIPANT_STATUS.SHOWED_UP || withdrawn

  const numRegistered = party.participants.length
  const numShowedUp = calculateNumAttended(party.participants)

  const payout = calculateWinningShare(deposit, numRegistered, numShowedUp)

  return (
    <GlobalConsumer>
      {({ userAddress, loggedIn }) => (
        <ParticipantWrapper to={`/user/${user.username}`} amAdmin={amAdmin}>
          <TwitterAvatar user={user} size={10} scale={6} />
          <ParticipantId>
            <ParticipantUsername>{user.username}</ParticipantUsername>
          </ParticipantId>
          {ended ? (
            attended ? (
              <Status type="won">
                {`${withdrawn ? ' Withdrew' : 'Won'} ${payout}`}{' '}
                <Currency tokenAddress={party.tokenAddress} />
              </Status>
            ) : (
              <Status type="lost">
                Lost{' '}
                {toEthVal(deposit)
                  .toEth()
                  .toString()}{' '}
                <Currency tokenAddress={party.tokenAddress} />{' '}
              </Status>
            )
          ) : (
            <>
              {attended ? (
                <Status type="marked">
                  Marked attended <Tick />
                </Status>
              ) : (
                <Status>Not marked attended</Status>
              )}
            </>
          )}
        </ParticipantWrapper>
      )}
    </GlobalConsumer>
  )
}

export default Participant
