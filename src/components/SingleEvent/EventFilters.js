import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import QrReader from 'react-qr-reader'

import { isAddress } from 'web3-utils'

import Button from '../Forms/Button'
import WarningBox from '../WarningBox'
import { Search } from '../Forms/TextInput'
import Label from '../Forms/Label'
import Select from '../Forms/Select'
import { ReactComponent as SearchIcon } from '../svg/Search.svg'

const QRCodeContainer = styled('div')`
  margin-bottom: 20px;
`
const Filter = styled('div')`
  width: 200px;
  margin-bottom: 20px;
`

const EventFiltersContainer = styled('div')``

const QRScannerContainer = styled('div')`
  margin-top: 20px;
  width: 100%;
`

const CenteredQrReader = styled(QrReader)`
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  width: 75%;
`

const ERROR_MESSAGES = {
  MALFORMED_DATA: "Couldn't read an address in QR code",
  FATAL_ERROR:
    'Could not access camera! Either you or your browser denied permission for camera access.'
}

const decodeQR = data => {
  if (!data) {
    return { success: false, payload: { stopScanning: false, type: 'NO_DATA' } }
  } else if (isAddress(data)) {
    // Plain address
    return { success: true, payload: { address: data } }
  } else if (/^ethereum:(0x[0-9a-fA-F]{40})$/.test(data)) {
    // Address prefixed with "ethereum:" https://github.com/ethereum/EIPs/blob/master/EIPS/eip-831.md
    // This is used by Coinbase Wallet
    const address = data.replace(/ethereum:/, '')
    return { success: true, payload: { address } }
  } else {
    return {
      success: false,
      payload: { stopScanning: false, type: 'MALFORMED_DATA' }
    }
  }
}

const EventFilters = props => {
  const {
    search,
    enableQrCodeScanner,
    handleFilterChange,
    amAdmin,
    ended,
    className
  } = props

  const [scannerActive, setScannerActive] = useState(false)
  const [scannerError, setScannerError] = useState(false)

  const [cameraAvailable, setCameraAvailable] = useState(true)

  useEffect(() => {
    if (navigator && navigator.permissions) {
      navigator.permissions.query({ name: 'camera' }).then(result => {
        if (result.state === 'denied') {
          _onError('FATAL_ERROR')
        }
      })
    }
  }, [])

  const _onSearch = val => {
    setScannerActive(false)
    props.handleSearch(val)
  }

  const _onError = errorType => {
    setScannerActive(false)
    setScannerError(ERROR_MESSAGES[errorType])

    if (errorType === 'FATAL_ERROR') {
      setCameraAvailable(false)
    } else {
      // If error is recoverable show error message for 3 seconds then hide again
      const TIME_ERROR_APPEARS = 3000
      setTimeout(() => setScannerError(false), TIME_ERROR_APPEARS)
    }
  }

  return (
    <EventFiltersContainer className={className}>
      {amAdmin && !ended && (
        <Filter>
          <Label>Filters</Label>
          <Select
            onChange={handleFilterChange}
            placeholder="Choose"
            options={[
              { label: 'All', value: 'all' },
              {
                label: 'Not marked attended',
                value: 'unmarked'
              },
              { label: 'Marked attended', value: 'marked' }
            ]}
          />
        </Filter>
      )}

      <Search
        type="text"
        Icon={SearchIcon}
        onChangeText={_onSearch}
        value={search}
        placeholder="Search for names or addresses"
        wide
      />
      {enableQrCodeScanner ? (
        <QRCodeContainer>
          <Button
            onClick={() => setScannerActive(!scannerActive)}
            disabled={!cameraAvailable}
          >
            {' '}
            {scannerActive ? 'Stop Scanning' : 'Scan QRCode'}
          </Button>
          {scannerError ? <WarningBox>{`${scannerError}`}</WarningBox> : null}
          {scannerActive ? (
            <QRScannerContainer>
              <CenteredQrReader
                delay={400} // delay = false stops scanning
                onError={err => {
                  _onError('FATAL_ERROR')
                }}
                onScan={data => {
                  const { success, payload } = decodeQR(data)
                  if (success) {
                    _onSearch(payload.address)
                  } else if (payload.stopScanning) {
                    _onError(payload.type)
                  }
                }}
                resolution={1200}
              />
            </QRScannerContainer>
          ) : null}
        </QRCodeContainer>
      ) : null}
    </EventFiltersContainer>
  )
}

export default EventFilters
