import React, { Component } from 'react'
import styled from 'react-emotion'

import SafeMutation from '../../SafeMutation'
import Button from '../../Forms/Button'

const Form = styled('form')``

class PartyForm extends Component {
  constructor(props) {
    super(props)
    const {
      name = '',
      description = '',
      location = '',
      date = '',
      image = '',
      deposit = '0.02',
      coolingPeriod = `${60 * 60 * 24 * 7}`,
      limitOfParticipants = 20
    } = props
    this.state = {
      name,
      description,
      location,
      date,
      image,
      deposit,
      coolingPeriod,
      limitOfParticipants
    }
  }

  render() {
    const {
      name,
      description,
      location,
      date,
      image,
      deposit,
      limitOfParticipants,
      coolingPeriod
    } = this.state

    const {
      type = 'Create Pending Party',
      onCompleted,
      mutation,
      address,
      children,
      variables: extraVariables = {}
    } = this.props

    const variables = {
      meta: { name, description, location, date, image },
      ...extraVariables
    }

    if (type === 'Update Party Meta') {
      variables.address = address
    }

    return (
      <Form onSubmit={e => e.preventDefault()}>
        <div>
          <label for="eventName">Name</label>
          <input
            id="eventName"
            value={name}
            onChange={e => this.setState({ name: e.target.value })}
            type="text"
            placeholder="Name of the event"
          />
          <br />
          <label for="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="Description of the event"
          >
            {description}
          </textarea>
          <br />
          <label for="location">Location</label>
          <input
            id="location"
            value={location}
            onChange={e => this.setState({ location: e.target.value })}
            type="text"
            placeholder="Location of the event"
          />
          <br />
          <label for="date">Dates</label>
          <input
            id="date"
            value={date}
            onChange={e => this.setState({ date: e.target.value })}
            type="text"
            placeholder="Dates of the event"
          />
          <br />
          <label for="image">Image</label>
          <input
            id="image"
            value={image}
            onChange={e => this.setState({ image: e.target.value })}
            type="text"
            placeholder="URL to image for the event"
          />
          <br />
          {type === 'Create Pending Party' && (
            <>
              <label for="commitment">Commitment</label>
              <input
                id="commitment"
                value={deposit}
                onChange={e => this.setState({ deposit: e.target.value })}
                type="text"
                placeholder="ETH"
              />
              <br />
              <label for="limit">Limit of participants</label>
              <input
                id="limit"
                value={limitOfParticipants}
                onChange={e =>
                  this.setState({
                    limitOfParticipants: e.target.value
                  })
                }
                type="text"
                placeholder="number of participants"
              />
              <br />
              <label for="coolingPeriod">Cooling period</label>
              <input
                id="coolingPeriod"
                value={coolingPeriod}
                onChange={e =>
                  this.setState({
                    coolingPeriod:
                      0 < parseInt(e.target.value) ? e.target.value : '1'
                  })
                }
                type="text"
                placeholder="Cooling period in seconds"
              />
            </>
          )}
        </div>

        {children}

        <SafeMutation
          mutation={mutation}
          resultKey="id"
          variables={variables}
          onCompleted={
            onCompleted
              ? ({ id }) =>
                  onCompleted(
                    { id },
                    deposit,
                    limitOfParticipants,
                    coolingPeriod
                  )
              : null
          }
        >
          {mutate => (
            <div>
              <Button onClick={mutate} analyticsId={type}>
                {type}
              </Button>
            </div>
          )}
        </SafeMutation>
      </Form>
    )
  }
}

export default PartyForm
