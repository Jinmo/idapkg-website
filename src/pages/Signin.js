import React, { Component } from 'react';
import { Container, Dimmer, Form, Message, Header, Button } from 'semantic-ui-react'

import CommonMenu from '../components/CommonMenu'
import { API_BASE, axiosWithProgress } from '../config'

export default class Signin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      error: null
    }
  }
  render() {
    const { user, history, onLogin } = this.props
    const { loading, error } = this.state

    return (
      <React.Fragment>
        <CommonMenu user={user} title="idapkgs" history={history} />
        <Container>
          <Dimmer.Dimmable dimmed={loading}>
            <Dimmer inverted onClickOutside={() => { }} />
            <Form className="text content" onSubmit={(event) => {
              const data = {
                username: event.target.username.value,
                password: event.target.password.value
              };

              axiosWithProgress.post(API_BASE + '/login', data, { withCredentials: true })
                .then(response => {
                  const data = response.data;

                  this.setState({
                    loading: false
                  })

                  if (data.success) {
                    // At this point, backend also provided session cookies. Update login
                    onLogin(data.data)
                    history.push('/')
                  } else {
                    this.setState({
                      error: data.error
                    })
                  }
                })
                .catch(err => {
                  this.setState({
                    error: err + ''
                  })
                })

              this.setState({
                loading: true
              });
            }}>
              {error && <Message>
                <Message.Header>Error</Message.Header>
                <p>{error}</p>
              </Message>}
              <Header as="h1">Signing in</Header>

              <Form.Field>
                <label>ID / E-MAIL</label>
                <input name="username" autoComplete="off" required pattern="([a-zA-Z0-9._\-]+|.*@.*)" />
              </Form.Field>

              <Form.Field>
                <label>PASSWORD</label>
                <input name="password" type="password" pattern=".{8,}" />
              </Form.Field>

              <Button type="submit" color="black">Let's go</Button>

            </Form>
          </Dimmer.Dimmable>
        </Container>
      </React.Fragment>

    )
  }
}

