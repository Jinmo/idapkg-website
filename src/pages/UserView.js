import React, { Component } from 'react'
import { Container, Header, Button, Icon, Divider } from 'semantic-ui-react'
import CommonMenu from '../components/CommonMenu'
import PackageItem from '../components/PackageItem'
import moment from 'moment'

import { API_BASE, axiosWithProgress } from '../config'


export default class UserView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      data: null
    }

    this.loadUser(props.match.params.id)
  }

  loadUser(user) {
    axiosWithProgress.get(API_BASE + '/user/packages?username=' + encodeURIComponent(user))
      .then(response => {
        this.setState({
          loading: false,
          data: response.data
        })
      })
  }

  componentDidUpdate(prevProps, prevState) {
    const { loading } = prevState;

    if (loading || this.props.match.params.id !== prevProps.match.params.id)
      this.loadUser(this.props.match.params.id)
  }

  render() {
    const { user, history } = this.props
    const { loading, data: _data } = this.state
    const { data } = _data || {};
    return (
      <React.Fragment>
        <CommonMenu history={history} user={user} title="idapkg / user" />
        {(loading) ? (
          <div className="page-header">
          </div>
        ) : (
            <React.Fragment>
              <div className="page-header" style={{ paddingBottom: '2rem' }}>
                <Container>
                  <Header as="h1">
                    {this.props.match.params.id}
                    <Header.Subheader className="package-misc">Created {moment(data.createdAt).fromNow()}</Header.Subheader>
                  </Header>
                </Container>
              </div>
              <Container>
                <div style={{ overflow: "hidden" }}>
                  <Header as="h2" floated="left" style={{ marginBottom: 0 }}>
                    Packages - {data ? data.packages.length : 0} item{(!(data && data.packages) || data.packages.length !== 1) && 's'}
                  </Header>
                  {(user && user.username) === this.props.match.params.id && (
                    <Button basic icon labelPosition="right" as="a" href="/upload">
                      Upload
                      <Icon name="upload" />
                    </Button>
                  )}
                </div>
                <Divider />
                {data && data.packages.map(item => (
                  <PackageItem {...item} key={item.id} />
                ))}
              </Container>
            </React.Fragment>
          )}
      </React.Fragment>
    )
  }
}

