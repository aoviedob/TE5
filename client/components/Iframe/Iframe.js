import React, { Component } from 'react';

export default class Iframe extends Component {
  constructor(props, context) {
    super(props, context);
  }


  handleMessage = e => {
    const { onMessage, src } = this.props;

    const args = e.data;

    if (!args || !args.content) {
      // TODO: should we warn??
      return;
    }

    onMessage && onMessage(args.content);
  };

  componentDidMount() {
    window.addEventListener('message', this.handleMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage);
  }

  render() {
    const {
      src,
      onMessage, // eslint-disable-line
      ...props
    } = this.props;

    return <iframe onLoad={this.handleLoad} src={src} {...props} />;
  }
}
