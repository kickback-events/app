import React from 'react'
import styled from 'react-emotion'

const Link = styled('a')``

const EtherScanLink = ({ address, tx, children }) => {
  let link
  if (address) {
    link = `https://etherscan.io/address/${address}`
  } else if (tx) {
    link = `https://etherscan.io/tx/${tx}`
  }
  return (
    <Link target="_blank" href={link}>
      {children}
    </Link>
  )
}

export default EtherScanLink
