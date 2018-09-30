import React, { createContext, Component } from 'react'
import { withApollo } from 'react-apollo'
import jwt from 'jsonwebtoken'

import * as LocalStorage from './api/localStorage'
import { getAccount } from './api/web3'
import { SIGN_IN } from './modals'

const GlobalContext = createContext({})

export const GlobalConsumer = GlobalContext.Consumer

let setProviderInstance
const providerPromise = new Promise(resolve => { setProviderInstance = resolve })

let setSignedIn
const signInPromise = new Promise(resolve => { setSignedIn = resolve })

export const getProvider = () => providerPromise

const AUTH_TOKEN = 'authToken'

class Provider extends Component {
  state = {
    apolloClient: this.props.client,
    currentModal: null,
    auth: {
      token: LocalStorage.getItem(AUTH_TOKEN)
    }
  }

  authToken () {
    return this.state.auth.token
  }

  apolloClient () {
    return this.state.apolloClient
  }

  isLoggedIn () {
    return this.state.auth.loggedIn
  }

  async signIn () {
    this.setState(state => ({
      auth: {
        ...state.auth,
        token: undefined,
        loggedIn: false,
      }
    }))

    this.showModal(SIGN_IN)

    return signInPromise
  }

  setAuthTokenFromSignature = (address, sig) => {
    const token = jwt.sign({ address, sig }, 'kickback', { algorithm: 'HS256' })

    console.log(`New auth token: ${token}`)

    // save to local storage for next time!
    LocalStorage.setItem(AUTH_TOKEN, token)

    this.setState(state => ({
      auth: {
        ...state.auth,
        token,
        loggedIn: true, /* we'll assume token works */
      }
    }), /* now we resolve the promsie -> */ setSignedIn)
  }

  showModal = modal => {
    this.setState({
      currentModal: modal
    })
  }

  toggleModal = modal => {
    this.setState(state => (
      (state.currentModal === modal)
        ? { currentModal: null }
        : { currentModal: modal }
    ))
  }

  async componentDidMount () {
    setProviderInstance(this)

    const address = await getAccount()

    this.setState(state => ({
      auth: {
        ...state.auth,
        address,
      }
    }))
  }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          currentModal: this.state.currentModal,
          userAddress: this.state.auth.address,
          loggedIn: this.state.auth.loggedIn,
          toggleModal: this.toggleModal,
          showModal: this.showModal,
          setAuthTokenFromSignature: this.setAuthTokenFromSignature,
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    )
  }
}

export const GlobalProvider = withApollo(Provider)
