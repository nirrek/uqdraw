import React, { Component, PropTypes } from 'react';
import Button from '../Button/Button.jsx';

export default class LinkButton extends Component {
  render() {
    const { to, type } = this.props;
    const { router } = this.context;

    return (
      <Button type={type} onClick={() => router.push(to)}>
        {this.props.children}
      </Button>
    );
  }
}

LinkButton.propTypes = {
  to: PropTypes.string,
  type: PropTypes.oneOf(['primary', 'secondary', 'unstyled']),
};

LinkButton.contextTypes = {
  router: PropTypes.object
};
