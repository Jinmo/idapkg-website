import React, { Component } from 'react';
import { Menu, Icon, Search } from 'semantic-ui-react'
import axios from 'axios';
import { API_BASE } from '../config'
import { Link } from 'react-router-dom'

class CommonMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: props.defaultValue || '',
      results: null
    };
  }

  render() {
    const { title, history, user } = this.props;
    const { searchValue, results } = this.state;

    return (
      <Menu className="massive top">
        <Menu.Item onClick={() => history.push('/')}>
          {title}
        </Menu.Item>
        <form style={{ flex: 1 }} onSubmit={(event) => {
          event.preventDefault();
          const query = this.state.searchValue.trim();
          if (query.length >= 2)
            history.push('/search?q=' + encodeURIComponent(query))
          return false;
        }} action="/search" method="GET">
          <Search fluid minCharacters={1} className="item" id="package-search" value={searchValue} onSearchChange={(event, data) => {
            this.setState({ searchValue: data.value });
            axios.get(API_BASE + '/search?q=' + encodeURIComponent(data.value)).then(response => {
              this.setState({ results: response.data.data.map(item => ({ id: item.id, title: `${item.name} ${item.version}`, description: item.description })) })
            })
          }} results={results} onResultSelect={(event, { result }) => history.push('/p/' + encodeURIComponent(result.id))}>
          </Search>
        </form>
        {user ? (
          <Menu.Item>
            <Link to={`/user/${user.username}`} className="ui black icon left labeled button">
              <Icon name="user" />
              <span>{user.username}</span>
            </Link>
            <Link to="/logout" className="ui basic login icon button">
              <Icon name="sign out" />
            </Link>
          </Menu.Item>
        ) : (
            <Menu.Item>
              <Link to="/signup" className="ui black icon left labeled button">
                <Icon name="sign-in" />
                SIGN UP
              </Link>
              <Link to="/login" className="ui basic login button">
                LOG IN
              </Link>
            </Menu.Item>

          )}
      </Menu>
    );
  }
};

export default CommonMenu
