import getWeb3, { getAccount, getTokenBySymbol, getWeb3Read } from '../web3'
// import { Token } from '@wearekickback/contracts'

import DETAILEDERC20_ABI from '../abi/detailedERC20ABI'
import DETAILEDERC20BYTES32_ABI from '../abi/detailedERC20bytes32ABI'
import { txHelper, isEmptyAddress } from '../utils'
export const defaults = {}
// This is because some token uses string as symbol while others are bytes32
// We need some workaround like https://ethereum.stackexchange.com/questions/58945/how-to-handle-both-string-and-bytes32-method-returns when supporting any ERC20

let token

const getTokenContract = (web3, address, abi) => {
  return new web3.eth.Contract(abi, address).methods
}

const resolvers = {
  Query: {
    async getTokenBySymbol(_, { symbol }) {
      const address = await getTokenBySymbol(symbol)
      return { address }
    },
    async getTokenAllowance(_, { userAddress, tokenAddress, partyAddress }) {
      try {
        const web3 = await getWeb3Read()
        // If token is Ether then give ether balance as allowance
        if (isEmptyAddress(tokenAddress)) {
          const balance = await web3.eth.getBalance(userAddress)
          return {
            balance,
            allowance: balance
          }
        }

        const contract = getTokenContract(web3, tokenAddress, DETAILEDERC20_ABI)
        const allowance = await contract
          .allowance(userAddress, partyAddress)
          .call()
        const balance = await contract.balanceOf(userAddress).call()
        return { allowance, balance }
      } catch (err) {
        console.log('Failed to fetch tokenAllowance', err)
        return { allowance: null, balance: null }
      }
    },
    async getTokenDecimals(_, { tokenAddress }) {
      if (isEmptyAddress(tokenAddress)) {
        return { decimals: 18 } //Ethereum
      }
      const web3 = await getWeb3Read()

      try {
        const contract = getTokenContract(web3, tokenAddress, DETAILEDERC20_ABI)
        const decimals = await contract.decimals().call()
        return { decimals }
      } catch (err) {
        throw new Error(
          `Failed to get Token Decimals (tokenAddress: ${tokenAddress})`
        )
      }
    },
    async getToken(_, { tokenAddress }) {
      if (token) return token
      if (isEmptyAddress(tokenAddress)) {
        return {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        }
      } else if (
        tokenAddress === '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'
      ) {
        // Fudge name and symbol for DAI v1 (SAI) to prevent confusion
        return {
          name: 'Sai Stablecoin',
          symbol: 'SAI',
          decimals: 18
        }
      }
      const web3 = await getWeb3Read()

      try {
        const contract = getTokenContract(web3, tokenAddress, DETAILEDERC20_ABI)
        let [name, symbol, decimals] = await Promise.all([
          contract.name().call(),
          contract.symbol().call(),
          contract.decimals().call()
        ])
        return { name, symbol, decimals }
      } catch (err) {
        try {
          const contract = getTokenContract(
            web3,
            tokenAddress,
            DETAILEDERC20BYTES32_ABI
          )
          let [name, symbol, decimals] = await Promise.all([
            contract.name().call(),
            contract.symbol().call(),
            contract.decimals().call()
          ])

          // To fit in a bytes32 on the contract, token name and symbol
          // have been padded to length using null characters.
          // We then strip these characters using the regex `/\u0000/g`
          const NULL_CHAR = '\u0000'
          name = web3.utils.toAscii(name).replace(`/${NULL_CHAR}/g`, '') // eslint-disable-line no-control-regex
          symbol = web3.utils.toAscii(symbol).replace(`/${NULL_CHAR}/g`, '') // eslint-disable-line no-control-regex
          return { name, symbol, decimals }
        } catch (err) {
          console.log('Failed to get Token')
          return { name: null, symbol: null, decimals: 18 }
        }
      }
    }
  },
  Mutation: {
    async approveToken(_, { tokenAddress, deposit, address }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const contract = getTokenContract(web3, tokenAddress, DETAILEDERC20_ABI)
      try {
        const tx = await txHelper(
          contract.approve(address, deposit).send({
            from: account
          })
        )

        return tx
      } catch (err) {
        console.error(err)

        throw new Error(`Failed to approve`)
      }
    }
  }
}

export default resolvers
