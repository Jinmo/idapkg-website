import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import { Container } from 'semantic-ui-react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import CommonMenu from './components/CommonMenu';
import Searcher from './components/Searcher'

import Home from './pages/Home';
import PackageView from './pages/PackageView';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Logout from './pages/Logout';
import UserView from './pages/UserView';
import Upload from './pages/Upload'

import { API_BASE, axiosWithProgress, marked } from './config'

// Some static file path
import gettingStartedPath from './getting-started.md';

const Markdown = (path) => {
  class MarkdownRenderer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        content: null
      };
    }
    componentDidMount() {
      axiosWithProgress.get(path, { responseType: 'text' }).then(response => {
        this.setState({
          content: response.data,
          loading: false
        })
      })
    }
    render() {
      const { loading, content } = this.state;
      const { history } = this.props;
      return (
        <React.Fragment>
          <CommonMenu user={this.props.user} title="idapkgs / getting-started" history={history} />
          {loading ? (
            <React.Fragment />
          ) : (
              <Container>
                <div className="markdown text content" dangerouslySetInnerHTML={({ __html: marked(content) })}>
                </div>
              </Container>
            )}
        </React.Fragment>
      )
    }
  };
  return MarkdownRenderer;
}

const GettingStarted = Markdown(gettingStartedPath)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialLoading: true,
      user: null
    };
  }

  componentDidMount() {
    axios.get(API_BASE + '/user', { withCredentials: true }).then(response => {
      const data = response.data
      const newStateData = {
        initialLoading: false
      }
      if (data.success) {
        Object.assign(newStateData, {
          user: data.data
        })
      }
      this.setState(newStateData)
    })
  }

  onLogin = (user) => {
    this.setState({ user })
  }

  render() {
    const { user, initialLoading } = this.state;
    const { onLogin } = this;

    return (
      <Router>
        <Route exact path="/" render={props => <Home {...props} user={user} />} />
        <Route path="/search" render={props => <Searcher {...props} user={user} />} />
        <Route path="/p/:id" render={props => <PackageView {...props} user={user} />} />
        <Route path="/user/:id" render={props => <UserView {...props} user={user} initialLoading={initialLoading} />} />
        <Route path="/getting-started" render={props => <GettingStarted {...props} user={user} />} />
        <Route path="/signup" render={props => <Signup {...props} onLogin={onLogin} user={user} />} />
        <Route path="/login" render={props => <Signin {...props} onLogin={onLogin} user={user} />} />
        <Route path="/logout" render={props => <Logout onLogin={onLogin} />} />
        <Route path="/upload" render={props => <Upload {...props} user={user} initialLoading={initialLoading} />} />
      </Router>
    );
  }
}

export default App;
