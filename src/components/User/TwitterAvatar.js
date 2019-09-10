import React from 'react'
import styled from 'react-emotion'
import { getSocialId } from '@wearekickback/shared'

import DefaultAvatar from './Avatar'

const Avatar = styled(DefaultAvatar)`
  height: 40px;
  width: 40px;
  flex-shrink: 0;
`

const TwitterAvatar = ({ className, user, size, scale }) => {
  const avatarId = getSocialId(user.social, 'twitter')
  let avatarUrl
  let blockies

  if (avatarId) {
    avatarUrl =
      scale > 10
        ? `https://avatars.io/twitter/${avatarId}/medium`
        : `https://avatars.io/twitter/${avatarId}/large`
  } else {
    blockies = user.address
  }

  return (
    <Avatar
      className={className}
      src={avatarUrl}
      blockies={blockies}
      username={user.username}
      size={size}
      scale={scale}
    />
  )
}

export default TwitterAvatar
