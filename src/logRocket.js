import LogRocket from 'logrocket'

import { LOGROCKET_TOKEN } from './config'

if (LOGROCKET_TOKEN) {
  LogRocket.init(LOGROCKET_TOKEN)
}

export const init = () => {
  if (LOGROCKET_TOKEN) {
    LogRocket.init()
  }
}

export const identify = profile => {
  if (LOGROCKET_TOKEN) {
    LogRocket.identify(profile.id, {
      address: profile.address,
      name: profile.realName || 'Unknown',
      email: profile.email.verified || profile.email.pending || 'Unknown'
    })
  }
}
