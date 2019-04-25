import React, { Component } from 'react'
import { Container, Dimmer, Form, Message, Header, Button } from 'semantic-ui-react'

import CommonMenu from '../components/CommonMenu'
import { API_BASE, axiosWithProgress } from '../config'

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null
    };
  }
  render() {
    const { history, onLogin } = this.props;
    const { loading, error } = this.state;
    return (
      <React.Fragment>
        <CommonMenu user={this.props.user} title="idapkgs" history={history} />
        <Container>
          <Dimmer.Dimmable dimmed={loading}>
            <Dimmer active={loading} inverted onClickOutside={() => { }} />
            <Form className="text content" onSubmit={(event) => {
              const data = {
                username: event.target.username.value,
                password: event.target.password.value,
                email: event.target.email.value
              };

              axiosWithProgress.post(API_BASE + '/signup', data)
                .then(response => {
                  const data = response.data;

                  this.setState({
                    loading: false
                  })

                  if (data.success) {
                    // At this point, backend also provided session cookies. Update login
                    onLogin(data.data)
                    history.push('/login')
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
              <Header as="h1">Signing up</Header>

              <Form.Field>
                <label>ID</label>
                <input name="username" placeholder="must be alnum, dash, or underscore" autoComplete="off" required pattern="[a-zA-Z0-9._\-]+" />
              </Form.Field>

              <Form.Field>
                <label>PASSWORD</label>
                <input name="password" type="password" placeholder="at least 8 characters, uses bcrypt" pattern=".{8,}" />
              </Form.Field>

              <Form.Field>
                <label>E-MAIL (for gravatar, password reset)</label>
                <input name="email" type="email" placeholder="user@example.com" />
              </Form.Field>

              <Button type="submit" color="black">Let's go</Button>
            </Form>
          </Dimmer.Dimmable>
        </Container>
      </React.Fragment>
    )
  }
}

