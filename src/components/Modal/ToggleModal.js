import React, { PureComponent } from 'react'
import styled from 'react-emotion'
import { GlobalConsumer } from '../../GlobalState'

class ToggleModal extends PureComponent {
  render() {
    const { className, children, modalName } = this.props
    return (
      <GlobalConsumer>
        {({ toggleModal }) => (
          <ToggleModalContainer
            className={className}
            onClick={() => toggleModal(modalName)}
          >
            {children}
          </ToggleModalContainer>
        )}
      </GlobalConsumer>
    )
  }
}

const ToggleModalContainer = styled('div')`
  &:hover {
    cursor: pointer;
  }
`

export default ToggleModal
