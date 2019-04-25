import React, { Component } from 'react'
import { Container, Header, Dimmer, Loader, Popup, Icon } from 'semantic-ui-react'
import CommonMenu from '../components/CommonMenu'
import { axiosWithProgress, API_BASE, STORAGE_BASE, marked } from '../config'

export default class View extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: {},
      message: 'Click to copy'
    };
  }

  componentDidMount() {
    this.loadUser()
  }

  loadUser() {
    axiosWithProgress
      .get(API_BASE + '/info?id=' + encodeURIComponent(this.props.match.params.id))
      .then(response => {
        this.setState({ data: response.data.data, loading: false })
      });
    this.setState({ loading: true })
  }

  shouldComponentUpdate(nextProps, nextState) {
    const res = (
      nextProps.match.params.id !== this.props.match.params.id
      || nextProps.user !== this.props.user
      || nextState.loading !== this.state.loading
    )
    return res
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id
      || JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user)) {
      console.log(prevProps.user, this.props.user)
      console.log(prevProps.match.params.id, this.props.match.params.id)
      this.loadUser()
    }
  }

  render() {
    const { id } = this.props.match.params;
    const { loading } = this.state;
    const { name, readme, version, author } = this.state.data;

    return (
      <React.Fragment>
        <CommonMenu user={this.props.user} title={"idapkgs / " + id} history={this.props.history} />
        {loading ? (
          <Dimmer>
            <Loader />
          </Dimmer>
        ) : (
            <React.Fragment>
              <div className="page-header" style={{ marginBottom: 0, backgroundColor: '#111', backgroundImage: 'url("https://www.toptal.com/designers/subtlepatterns/patterns/prism.png")' }}>
                <Container>
                  <Header inverted as="h1">
                    {name}
                    <Header.Subheader className="package-misc">
                      <span>
                        {author}
                      </span>
                      <span>
                        {version}
                      </span>
                    </Header.Subheader>
                  </Header>
                  <Popup inverted position="bottom right" trigger={(
                    <div className="install-box ui icon right labeled basic button" onClick={(event) => {
                      window.getSelection().selectAllChildren(event.target);
                      document.execCommand('copy');
                      this.setState({
                        message: 'Copied!'
                      })
                      setTimeout(() => {
                        this.setState({
                          message: 'Click to copy'
                        })
                      }, 2000)
                    }}>
                      pkg.install('{id}', repo='{STORAGE_BASE}')
                    <Icon name="paste" />
                    </div>
                  )} content={this.state.message} />

                </Container>

              </div>
              <Header as="h3" block style={{marginTop: 0, border: 0, fontWeight: 400, marginBottom:'1.5rem', borderRadius: 0}}>
                <Container>readme</Container>
              </Header>
              <div className="ui container">
                {readme ? (
                <div className="markdown" dangerouslySetInnerHTML={({ __html: marked(readme) })}>
                </div>) : (
                <div className="markdown empty">
                  <Header icon disabled textAlign="center" size="huge">
                    <Icon name="shopping bag" style={{transform: "rotate(-8deg)", paddingBottom: "1rem"}} />
                    There is no readme, yet.
                  </Header>
                </div>
                )}
              </div>
            </React.Fragment>
          )}
      </React.Fragment>
    );
  }
};

