import React, { Component } from 'react'
import styled from 'react-emotion'
import Button from '../components/Forms/Button'
import { GlobalConsumer } from '../GlobalState'

const ConfirmModalContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Buttons = styled('div')`
  display: flex;
  justify-content: flex-end;
`

const Message = styled('div')`
  margin-bottom: 20px;
  line-height: 1.6em;
`

const Cancel = styled(Button)`
  margin-right: 20px;
`

class ConfirmModal extends Component {
  state = {
    mutationStarted: false
  }
  startMutation = () => this.setState({ mutationStarted: true })
  render() {
    const { mutation, mutationComponent, message } = this.props
    return (
      <GlobalConsumer>
        {({ closeModal }) => (
          <ConfirmModalContainer>
            <Message>{message}</Message>

            <Buttons>
              <Cancel
                onClick={() => closeModal({ name: 'CONFIRM_TRANSACTION' })}
                type="hollow"
              >
                {this.state.mutationStarted ? 'Close' : 'Cancel'}
              </Cancel>
              {mutationComponent ? (
                <div onClick={this.startMutation}>{mutationComponent}</div>
              ) : (
                <Button
                  onClick={() => {
                    this.startMutation()
                    mutation()
                  }}
                >
                  Confirm
                </Button>
              )}
            </Buttons>
          </ConfirmModalContainer>
        )}
      </GlobalConsumer>
    )
  }
}

export default ConfirmModal
