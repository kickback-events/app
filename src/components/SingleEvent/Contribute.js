import React from 'react'
import SendAndWithdraw from './SendAndWithdraw'
import WithdrawAll from './EventCTA'
import { depositValue } from '../Utils/DepositValue'
import TwitterAvatar from '../User/TwitterAvatar'
import styled from '@emotion/styled'
const UserAvatar = styled(TwitterAvatar)`
  margin-right: 10px;
  margin-left: 10px;
`

const ContributionDetail = styled('p')`
  display: flex;
  align-items: center;
`

const Contribute = ({
  address,
  percentage,
  myShare,
  changeMode,
  changeValue,
  currencySymbol,
  delimiters,
  addresses,
  roles
}) => {
  const value = parseInt(myShare * (percentage / 100))
  const leftOver = myShare - value
  const recipient = roles.filter(r => r.user.address === addresses[0])[0]

  return (
    <>
      <p>How much would you like to contribute?</p>
      {percentage} % :{' '}
      <input
        type="range"
        value={percentage}
        name="percentage"
        onChange={changeValue.bind(this)}
        min="0"
        max="100"
      />
      <br></br>
      <ContributionDetail>
        Total contribution: {depositValue(value, delimiters.length, 3)}{' '}
        {currencySymbol} (and withdraw{' '}
        {depositValue(leftOver, delimiters.length, 3)} {currencySymbol}) goes to{' '}
        {recipient ? (
          <UserAvatar user={recipient.user} size={5} scale={5} />
        ) : (
          `${addresses[0].slice(0, 5)}...`
        )}
      </ContributionDetail>
      <SendAndWithdraw
        address={address}
        addresses={addresses}
        values={[value]}
      ></SendAndWithdraw>
      <a
        href="#/"
        onClick={e => {
          e.preventDefault()
          changeMode(WithdrawAll)
        }}
      >
        Or Go back{' '}
      </a>
    </>
  )
}

export default Contribute
