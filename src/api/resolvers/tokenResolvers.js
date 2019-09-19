import getWeb3, { getAccount, getTokenBySymbol } from '../web3'
// import { Token } from '@wearekickback/contracts'

import { txHelper, isEmptyAddress } from '../utils'
export const defaults = {}
// This is because some token uses string as symbol while others are bytes32
// We need some workaround like https://ethereum.stackexchange.com/questions/58945/how-to-handle-both-string-and-bytes32-method-returns when supporting any ERC20
const detailedERC20bytes32ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'who', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_symbol', type: 'string' },
      { name: '_decimals', type: 'uint8' }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  }
]

let token

const getTokenContract = (web3, address) => {
  return new web3.eth.Contract(detailedERC20bytes32ABI, address).methods
}

const resolvers = {
  Query: {
    async getTokenBySymbol(_, { symbol }) {
      const address = await getTokenBySymbol(symbol)
      return { address }
    },
    async getTokenAllowance(_, { tokenAddress, partyAddress }) {
      const web3 = await getWeb3()
      const contract = getTokenContract(web3, tokenAddress)
      try {
        const account = await getAccount()
        const allowance = await contract.allowance(account, partyAddress).call()
        return { allowance }
      } catch (err) {
        console.log('Failed to fetch tokenAllowance', err)
        return { allowance: null }
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
      }
      const web3 = await getWeb3()
      const contract = getTokenContract(web3, tokenAddress)

      try {
        let [name, symbol, decimals] = await Promise.all([
          contract.name().call(),
          contract.symbol().call(),
          contract.decimals().call()
        ])
        name = web3.utils.toAscii(name)
        symbol = web3.utils.toAscii(symbol)
        return { name, symbol, decimals }
      } catch (err) {
        throw new Error(`Failed to get Token`)
      }
    }
  },
  Mutation: {
    async approveToken(_, { tokenAddress, deposit, address }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const contract = getTokenContract(web3, tokenAddress)
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
