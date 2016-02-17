import React, { Component } from 'react';

export default (ComposedComponent) => class extends Component {
  constructor(props) {
    super(props);
    this.data = {};
    this.handlers = {
      onMouseMove: this.onMouseMove.bind(this),
      onMouseDown: this.onMouseDown.bind(this),
      onMouseUp: this.onMouseUp.bind(this),
      onMouseOut: this.onMouseOut.bind(this),
    };
  }

  onMouseMove(event) {
    if (this.data.curDown === true) {
      var node = this.data.node,
          offset = this.data.curXPos - event.pageX,
          scrollLeft = node.scrollLeft,
          maxScroll = node.scrollWidth - node.clientWidth;

      // Stop measuring negative offsets once scroll is 0
      // This avoids buffering up scroll left distance if you keep dragging
      // past the minimum scroll value
      if (scrollLeft <= 0 && offset < 0) {
        this.data.curScrollPos = 0;
        this.data.curXPos = event.pageX;
      }

      // Stop measuring positive offsets once max scroll is reached
      // This avoids buffering up scroll right distance if you keep dragging
      // past the maximum scroll value
      else if (scrollLeft >= maxScroll && offset > 0) {
        this.data.curScrollPos = maxScroll;
        this.data.curXPos = event.pageX;
      }

      node.scrollLeft = this.data.curScrollPos + offset;
    }
  }

  onMouseDown(event) {
    this.data.curDown = true;
    this.data.curXPos = event.pageX;
    this.data.curScrollPos = this.data.node.scrollLeft;
  }

  onMouseUp() {
    this.data.curDown = false;
  }

  onMouseOut() {
    this.data.curDown = false;
  }

  setScrollRef(component) {
    let node = React.findDOMNode(component);
    this.data.node = node;
  }

  render() {
    return (
      <ComposedComponent {...this.props} scrollHandlers={this.handlers} setScrollRef={this.setScrollRef.bind(this)}/>
    );
  }
};
