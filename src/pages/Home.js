import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react'
import CommonMenu from '../components/CommonMenu'
import { Link } from 'react-router-dom'

class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <CommonMenu user={this.props.user} title="idapkgs" history={this.props.history} />
        <Container>
          <div className="masthead">
            <Header as="h1" size="huge" textAlign="center">Package manager for IDA Pro</Header>
            <Link to="/getting-started" className="ui big green basic button getting-started">Get started</Link>
          </div>
        </Container>
      </React.Fragment>
    );
  }
};

export default Home
