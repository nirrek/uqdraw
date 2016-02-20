import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal2';
import { Gateway } from 'react-gateway';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import elementClass from 'element-class';
import './Modal.scss';

export default class Modal extends Component {
  componentWillUpdate(nextProps) {
    if (nextProps.isOpen)
      elementClass(document.body).add('disableScroll');
    else
      elementClass(document.body).remove('disableScroll');
  }

  render() {
    const { isOpen, hasCloseButton, children, ...propsToDelegate } = this.props;

    return (
      <Gateway into="modal">
        <ReactCSSTransitionGroup
          transitionName="Modal"
          transitionAppear={true}
          transitionAppearTimeout={200}
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}>
          {this.props.isOpen && (
            <ReactModal
              {...propsToDelegate}
              backdropClassName={'Modal-backdrop'}
              modalClassName={'Modal'}>
              {hasCloseButton && (
                <div className="Modal-closeButton"
                     onClick={this.props.onClose}>
                  &times;
                </div>
              )}
              {children}
            </ReactModal>
          )}
        </ReactCSSTransitionGroup>
      </Gateway>
    );
  }
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  closeOnEsc: PropTypes.bool,
  closeOnBackdropClick: PropTypes.bool,
  backdropStyles: PropTypes.object,
  modalStyles: PropTypes.object,
};

Modal.defaultProps = {
  closeOnEsc: true,
  closeOnBackdropClick: true,
  hasCloseButton: true,
};
