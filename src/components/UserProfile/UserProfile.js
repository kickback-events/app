import React, { useContext } from 'react'
import styled from 'react-emotion'
import { getSocialId } from '@wearekickback/shared'
import EventList from './EventList'
import { H2, H3 } from '../Typography/Basic'
import mq from 'mediaQuery'
import { EDIT_PROFILE } from '../../modals'
import GlobalContext from '../../GlobalState'
import Button from '../Forms/Button'
import DefaultTwitterAvatar from '../User/TwitterAvatar'

const UserProfileWrapper = styled('div')`
  display: flex;
`

const UserProfileContainer = styled('article')`
  max-width: 700px;
  border-radius: 20px;
`

const ProfileDetails = styled('div')`
  margin-bottom: 20px;
  display: flex;
`

const Information = styled('div')`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
`

const AvatarWrapper = styled('div')`
  max-width: 150px;
`

const TwitterAvatar = styled(DefaultTwitterAvatar)`
  width: 150px;
  height: 150px;
`

const Events = styled('div')`
  display: flex;
  flex-direction: column;
  ${mq.medium`
    flex-direction: row;
  `}
`

const EventType = styled('div')`
  margin-right: 25px;
  &:last-child {
    margin-right: 0;
  }
`

const EditProfile = styled(Button)`
  margin-top: 20px;
`

export default function UserProfile({ profile: p }) {
  const twitter = getSocialId(p.social, 'twitter')
  const { showModal, loggedIn, userProfile } = useContext(GlobalContext)
  return (
    <UserProfileWrapper>
      <UserProfileContainer>
        <ProfileDetails>
          <AvatarWrapper>
            <TwitterAvatar user={p} scale={8} size={19} />
          </AvatarWrapper>
          <Information>
            <H2>{p.username}</H2>
            {twitter && (
              <a href={`https://twitter.com/${twitter}`}>Twitter: {twitter}</a>
            )}
            {loggedIn && userProfile && userProfile.username === p.username && (
              <EditProfile onClick={() => showModal({ name: EDIT_PROFILE })}>
                Edit Profile
              </EditProfile>
            )}
          </Information>
        </ProfileDetails>
        <Events>
          <EventType>
            <H3>Events Attended ({p.eventsAttended.length})</H3>
            <EventList events={p.eventsAttended} />
          </EventType>
          <EventType>
            <H3>Events Hosted ({p.eventsHosted.length})</H3>
            <EventList events={p.eventsHosted} />
          </EventType>
        </Events>
      </UserProfileContainer>
    </UserProfileWrapper>
  )
}
