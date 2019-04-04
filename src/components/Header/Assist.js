import getWeb3 from '../../api/web3'
import assist from 'bnc-assist'
import { BLOCKNATIVE_DAPPID } from '../../config'
import { track } from '../../api/analytics'

const Assist = async ({ action, expectedNetworkId }) => {
  console.log('Assist1')
  let web3
  console.log('Assist2')
  try {
    web3 = await getWeb3()
  } catch (e) {
    console.log('failed to get web3')
  }
  console.log('Assist3')
  // dappid is mandatory so will have throw away id for local usage.
  let testid = 'c212885d-e81d-416f-ac37-06d9ad2cf5af'
  let assistInstance = assist.init({
    dappId: BLOCKNATIVE_DAPPID || testid,
    web3: web3,
    networkId: expectedNetworkId,
    images: {
      welcome: {
        src: 'https://kickback.events/card.png',
        srcset: 'Welcome to Kickback'
      },
      complete: {
        src: 'https://kickback.events/card.png',
        srcset: 'Now you are ready to use Kickback'
      }
    }
  })
  console.log('Assist4')
  let state
  let result = {
    status: 'Already on boarded',
    action,
    error: false,
    fallback: false
  }

  try {
    console.log('Assist5')
    state = await assistInstance.getState()
  } catch (e) {
    console.log('Blocknative failing to get State', e)
  }
  console.log('Assist6')
  if (state) {
    console.log('state', state)
    let {
      correctNetwork,
      currentProvider,
      legacyWallet,
      legacyWeb3,
      mobileDevice,
      modernWallet,
      modernWeb3,
      supportedNetwork,
      web3Version,
      web3Wallet
    } = state
    result = {
      correctNetwork,
      currentProvider,
      legacyWallet,
      legacyWeb3,
      mobileDevice,
      modernWallet,
      modernWeb3,
      supportedNetwork,
      web3Version,
      web3Wallet,
      ...result
    }
    // Making sure that current provider is set.
    result.currentProvider = state.currentProvider
    console.log(
      'currentProvider',
      JSON.stringify([state.currentProvider, result])
    )
  } else {
    console.log('no state', JSON.stringify([result]))
    result.status = 'Problem getting state'
    result.error = true
    result.fallback = true
  }
  if (state && state.mobileDevice) {
    if (!state.web3Wallet) {
      result.status = 'Mobile wallet not detected'
      result.error = true
    } else {
      if (state.userCurrentNetworkId !== expectedNetworkId) {
        result.status = 'Wrong Network'
        result.error = true
      }
    }
    result.fallback = true
  } else {
    try {
      result.status = await assistInstance.onboard()
    } catch (error) {
      result.status = error
      result.error = true
    }
  }
  console.log('Connect to web3', JSON.stringify(result))
  track('Connect to web3', result)
  return result
}
export default Assist
