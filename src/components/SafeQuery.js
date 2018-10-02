import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'

import Loader from './Loader'
import ErrorBox from './ErrorBox'

const DEFAULT_IS_LOADING = ({ loading }) => loading
const DEFAULT_RENDER_ERROR = ({ error }) => <ErrorBox>{`${error}`}</ErrorBox>
const DEFAULT_RENDER_LOADING = () => <Loader />

export default class SafeQuery extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  render () {
    const {
      query,
      variables,
      children,
      isLoading = DEFAULT_IS_LOADING,
      renderError = DEFAULT_RENDER_ERROR,
      renderLoading = DEFAULT_RENDER_LOADING,
    } = this.props

    return (
      <Query query={query} variables={variables}>
        {result => {
          const { error } = result

          if (error) return renderError(result)
          if (isLoading(result)) return renderLoading(result)

          return children(result.data || {})
        }}
      </Query>
    )
  }
}
