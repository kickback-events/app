import React, { Component } from 'react'
import styled from 'react-emotion'

import EtherScanLink from '../ExternalLinks/EtherScanLink'
import { H2, H3 } from '../Typography/Basic'
import DefaultAvatar from '../User/Avatar'
import DepositValue from '../Utils/DepositValue'
import { ReactComponent as DefaultEthIcon } from '../svg/Ethereum.svg'
import { ReactComponent as DefaultPinIcon } from '../svg/Pin.svg'
import moment from 'moment'
// import Tooltip from '../Tooltip/Tooltip'

import { toEthVal } from '../../utils/units'
import { getSocial } from '../../utils/parties'

const Date = styled('div')``
const EventName = styled(H2)``
const ContractAddress = styled('h3')`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: Muli;
  font-weight: 500;
  font-size: 13px;
  color: #6e76ff;
  letter-spacing: 0;
`
const EventImage = styled('img')`
  border-radius: 4px;
  margin-bottom: 20px;
`

const Avatar = styled(DefaultAvatar)`
  margin-right: 10px;
  height: 35px;
  width: 35px;
  flex-shrink: 0;
`

const Organisers = styled('div')`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 50px;

  span {
    margin-right: 5px;
  }
`

const OrganiserList = styled('div')`
  display: flex;
  align-items: center;
  width: 100%;
`
const Organiser = styled('div')`
  display: flex;
  align-items: center;
  margin-right: 10px;
`

const PinIcon = styled(DefaultPinIcon)`
  margin-right: 10px;
`

const Location = styled('div')`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-family: Muli;
  font-weight: 500;
  font-size: 14px;
  color: #3d3f50;
  line-height: 21px;
`
const EthIcon = styled(DefaultEthIcon)`
  margin-right: 10px;
`
const TotalPot = styled('div')`
  font-family: Muli;
  font-weight: 600;
  font-size: 14px;
  color: #3d3f50;
  text-align: left;
  line-height: 21px;
  display: flex;
  align-items: center;
  span {
    font-weight: 400;
    margin-left: 0.5rem;
    margin-right: 1.5rem;
  }
`

const EventDescription = styled('p')`
  white-space: pre-line;
  line-height: 1.6em;
`
const Photos = styled('section')``
const PhotoContainer = styled('div')``
const Photo = styled('img')``
const Comments = styled('section')``
const Comment = styled('div')``

const HostUsername = styled('span')`
  font-weight: bold;
`

class EventInfo extends Component {
  render() {
    const { party, address, className } = this.props
    return (
      <EventInfoContainer className={className}>
        <Date>{party.date || 'Tuesday, 23rd Sep, 2018 9:00 PM'}</Date>
        <EventName>{party.name}</EventName>
        <ContractAddress>
          <EtherScanLink address={address}>{address}</EtherScanLink>
        </ContractAddress>
        <EventImage src={party.image || 'https://placeimg.com/640/480/tech'} />
        <Organisers>
          <H3>Organisers</H3>
          <OrganiserList>
            {[party.owner, ...party.admins].map(organiser => {
              return (
                <>
                  <Organiser>
                    <Avatar
                      src={`https://avatars.io/twitter/${getSocial(
                        organiser.social,
                        'twitter'
                      ) || 'randomtwitter'}`}
                    />{' '}
                    <HostUsername>{organiser.username}</HostUsername>
                  </Organiser>
                </>
              )
            })}
          </OrganiserList>
        </Organisers>
        <H3>Event Details</H3>
        <Location>
          <PinIcon />
          {party.location || '11 Macclesfield St, London W1D 5BW'}
        </Location>
        <TotalPot>
          <EthIcon />
          Total pot:{' '}
          <span>
            {toEthVal(party.deposit)
              .mul(party.participants.length)
              .toEth()
              .toFixed(2)}{' '}
            ETH
          </span>
          RSVP:{' '}
          <span>
            <DepositValue value={party.deposit} /> ETH
          </span>
          <span>
            <strong>Cooling Period: </strong>
            {moment
              .duration(parseInt(party.coolingPeriod, 16), 'seconds')
              .asDays()}{' '}
            days
          </span>
        </TotalPot>
        <EventDescription>{party.description}</EventDescription>
        <Photos>
          <PhotoContainer>
            <Photo />
          </PhotoContainer>
        </Photos>
        <Comments>
          <Comment />
        </Comments>
      </EventInfoContainer>
    )
  }
}

const EventInfoContainer = styled('div')``

export default EventInfo
