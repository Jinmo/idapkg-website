import React, { Component } from 'react'
import { List, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import gravatar from 'gravatar';

export default class PackageItem extends Component {
  render() {
    const { id, name, version, description, author, keywords } = this.props;
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
            {keywords.map(keyword => (
              <span className="ui label" key={keyword}>{keyword}</span>
            ))}
          </span>
        </p>
      </List.Item>
    )
  }
};

