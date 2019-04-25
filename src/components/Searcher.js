import React, { Component } from 'react'
import { API_BASE, axiosWithProgress } from '../config'
import { List, Container, Segment } from 'semantic-ui-react'
import CommonMenu from './CommonMenu'
import PackageItem from './PackageItem'

export default class Searcher extends Component {
  constructor(props) {
    super(props);
    const params = new URLSearchParams(window.location.search);

    this.state = {
      loading: true,
      query: params.get("q"),
      data: null
    };

    this.load(this.state.query);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const params = new URLSearchParams(window.location.search);
    if (params.get("q") !== nextState.query) {
      const query = params.get("q");
      this.setState({ query, loading: true, data: null });
      this.load(query);
      return true;
    }
    return this.state.loading !== nextState.loading;
  }

  load(query) {
    axiosWithProgress
      .get(API_BASE + '/search?q=' + encodeURIComponent(query))
      .then(response => {
        const data = response.data.data;

        this.setState({ loading: false, data });
      });
  }

  render() {
    const { loading, query, data } = this.state;
    return (
      <React.Fragment>
        <CommonMenu user={this.props.user} title="idapkgs" defaultValue={query} history={this.props.history} />
        <Segment basic loading={loading} attached className="package-list">
          {loading ? (
            <React.Fragment />
          ) : (data.length ?
            (
              <Container>
                <List>
                  {data.map(item => (
                    <PackageItem key={item.id} {...item}>
                    </PackageItem>
                  ))}
                </List>
              </Container>
            )
            : (
              <span className="empty">Empty</span>
            )
            )}
        </Segment>
      </React.Fragment>
    );
  }
};

