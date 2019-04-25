import React, { Component, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Redirect } from 'react-router-dom';

import { Container, Header } from 'semantic-ui-react'
import immutablejs from 'immutable'

import CommonMenu from '../components/CommonMenu'
import PackageItem from '../components/PackageItem'
import { API_BASE } from '../config'
import axios from 'axios'

const { List: ImmutableList, Map } = immutablejs

function MyDropzone({ onDrop: callback }) {
  const onDrop = useCallback(callback, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  )
}

export default class Upload extends Component {
  constructor(props) {
    super(props)

    this.state = {
      files: ImmutableList()
    }
  }
  uploadPackage = (file) => {
    const data = new FormData()
    const item = Map({
      name: file.name,
      loading: true,
      error: null,
      data: null,
      key: Math.random()
    })
    let index = this.state.files.size;

    data.append('file', file)
    axios.post(API_BASE + '/upload', data, { withCredentials: true })
      .then(response => {
        this.setState({
          files: this.state.files.set(index, item.merge({
            loading: false,
            error: response.data.error,
            data: response.data.data
          }))
        })
      })

    this.setState({
      files: this.state.files.push(item)
    })
  }
  onDrop = acceptedFiles => {
    acceptedFiles.forEach(this.uploadPackage)
  }
  render() {
    const { user, history, initialLoading } = this.props
    if(!initialLoading && user === null) {
      return (
        <Redirect to="/login" />
      )
    }
    return (
      <React.Fragment>
        <CommonMenu user={user} history={history} title="idapkgs / upload" />
        <Container>
          <div className="text content">
            <Header as="h1">Upload packages</Header>
            <MyDropzone onDrop={this.onDrop} />
            {this.state.files.map(item => (
              <React.Fragment key={item.get("key")}>
                {item.get("loading") ? <div className="upload-item">
                  {item.get("name")} - Uploading...
            </div> : item.get("error") ? <div className="upload-item">
                    {item.get("name")} - {item.get("error")}
                  </div> : <PackageItem {...item.get("data")} />}
              </React.Fragment>
            ))}
          </div>
        </Container>
      </React.Fragment>
    )
  }
}