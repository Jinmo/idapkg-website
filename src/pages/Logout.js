import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

import { API_BASE } from '../config'

export default class Logout extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true
    }
  }
  componentDidMount() {
    axios.get(API_BASE + '/logout').then(response => {
      this.props.onLogin(null)
      this.setState({ loading: false })
    })
  }
  render() {
    const { loading } = this.state
    if (!loading)
      return (
        <Redirect to="/" />
      )
    else
      return (<React.Fragment />)
  }
};

