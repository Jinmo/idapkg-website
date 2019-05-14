import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react'
import CommonMenu from '../components/CommonMenu'
import { Link } from 'react-router-dom'
import axios from 'axios';
import PackageItem from '../components/PackageItem';
import { API_BASE } from '../config';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      loading: true
    };
  }
  componentDidMount() {
    axios.get(API_BASE + '/search').then(response => {
      const data = response.data;

      if (data.success) {
        this.setState({ data: data.data, loading: false })
      }
    })
  }
  render() {
    const { data, loading } = this.state;
    return (
      <React.Fragment>
        <CommonMenu user={this.props.user} title="idapkgs" history={this.props.history} />
        <Container>
          {false && (
            <div className="masthead" >
              <Header as="h1" size="huge" textAlign="center">
                Package manager for IDA Pro
                </Header>
              <Link to="/getting-started"
                className="ui big green basic button getting-started" > Get started </Link>
            </div>
          )}
          {true && (
            <React.Fragment>
              <Header as="h2" size="large" dividing>
                Discover packages
              </Header>
              {!loading && data.map(item => (
                <PackageItem {...item} />
              ))}
            </React.Fragment>
          )}
        </Container>
      </React.Fragment>
    );
  }
};

export default Home
