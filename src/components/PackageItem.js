import React, { Component } from 'react'
import { List, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import gravatar from 'gravatar';

export default class PackageItem extends Component {
  render() {
    const { id, name, version, description, author, compat_win, compat_mac, compat_linux } = this.props;
    const compats = [['windows', compat_win],
    ['apple', compat_mac],
    ['linux', compat_linux]];
    return (
      <List.Item className="package-item item">
        <Link className="package-name ui header" to={`/p/${encodeURIComponent(id)}`}>
          {name}
        </Link>
        <p className="package-description">
          {description}
        </p>
        <p className="package-misc">
          <Image src={gravatar.url(author, { d: 'retro' })} avatar />
          <Link to={`/user/${encodeURIComponent(author)}`}>
            {author}
          </Link>
          <span>
            •
          </span>
          <span className="package-version">
            {version}
          </span>
          <span>
            {compats.filter(compat => compat[1]).map(compat => (
              <span className="ui label" key={compat[0]}>{compat[0]}</span>
            ))}
          </span>
        </p>
      </List.Item>
    )
  }
};

