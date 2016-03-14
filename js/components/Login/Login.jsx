/* @flow */
import React, { Component, PropTypes } from 'react';
import Logo from '../Logo/Logo.jsx';
import Modal, { ModalContent, ModalFooter } from '../Modal/Modal.jsx';
import FlatButton from '../FlatButton/FlatButton.jsx';
import Header from '../Header/Header.jsx';
import FocusableInput from '../FocusableInput/FocusableInput.jsx';
import Input from '../Input/Input.jsx';
import './Login.scss';

import { connect } from 'react-redux';
import * as PresentationViewerActions from '../../actions/PresentationViewerActions.js';
import Spinner from 'react-spinkit';

const codeLength = 3;

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      inputValues: ['', '', ''],
      focusedInputIndex: 0,
      usernameInput: '',
      passwordInput: '',
    };

    this.openLoginModal = this.openLoginModal.bind(this);
    this.closeLoginModal = this.closeLoginModal.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  // TODO remove once we move to using redux-simple-router
  componentWillReceiveProps(nextProps) {
    const { presentation } = nextProps;
    if (presentation) {
      this.context.router.push(`/presentation/${presentation.code}`);
    }
  }

  // TODO
  // - tab out after fixing a code needs to submit code
  // - backspace show jump between inputs
  handleInputChange(inputIndex, event) {
    const value = event.target.value;
    if (value.length > 1) return; // block entering more chars.

    // Update input values, and focused input.
    const newInputValues = this.state.inputValues.slice();
    newInputValues[inputIndex] = value;
    const newFocusedInputIndex = (value.length === 1) ?
      (inputIndex + 1) :
      this.state.focusedInputIndex;
    this.setState({
      inputValues: newInputValues,
      focusedInputIndex: newFocusedInputIndex
    });

    // Check if the full code has been entered.
    if (inputIndex === codeLength - 1 && value.length === 1) {
      const code = this.state.inputValues.join('') + value;

      // TODO validate the code is active; navigate to relevant page.
      if (code.length === codeLength) {
        this.props.presentationRequest(code);
        return;
      }
    }
  }

  onLogin(event) {
    event.preventDefault();
    const username = 'uqjstee8'; // TODO make programmatic
    this.context.router.push(`welcome/${username}`);
  }

  openLoginModal() {
    this.setState({ isModalOpen: true });
  }

  closeLoginModal() {
    this.setState({ isModalOpen: false });
  }

  handleInputFocus(index, event) {
    event.preventDefault();
    this.props.codeInputFocused();
    this.setState({ focusedInputIndex: index });
  }

  render() {
    const { inputValues } = this.state;
    const { isFetchingPresentation, fetchPresentationError } = this.props;

    return (
      <div className='StartView-Container' style={this.startViewContainerStyle}>
        <Header />

        <div className='MainContainer' style={this.startViewStyle}>
          <div className='Login'>
            <h1 className='Login-heading'>Enter Presenter's Code</h1>
            <div className='Login-subheading'>(shown on presenter&apos;s screen)</div>
            <div className='Login-code'>
              {inputValues.map((value, idx) => {
                const isFocused = idx === this.state.focusedInputIndex;
                return (
                  <FocusableInput
                    className='Login-codeInput'
                    key={idx}
                    type="text"
                    value={value}
                    isFocused={isFocused}
                    onFocus={this.handleInputFocus.bind(this, idx)}
                    onChange={this.handleInputChange.bind(this, idx)} />
                );
              })}
            </div>
            <div className="Login-codeInputSubmitState">
              {isFetchingPresentation &&
                <div>
                  <Spinner className="Login-codeInputSpinner" spinnerName='double-bounce' />
                </div>
              }
              {fetchPresentationError &&
                <div className="Login-codeInputError">
                  {fetchPresentationError.message}
                </div>
              }
            </div>
          </div>

          <div className='Login-presenterLogin'>
            <FlatButton onClick={this.openLoginModal}>
              Login as Presenter
            </FlatButton>
            <Modal isOpen={this.state.isModalOpen} onClose={this.closeLoginModal}>
              <ModalContent>
                <div className='Login-presenterLoginSlat'>
                  <Input placeholder="Username" />
                </div>
                <div className='Login-presenterLoginSlat'>
                  <Input type='password' placeholder="Password" />
                </div>
              </ModalContent>
              <ModalFooter>
                <FlatButton type='secondary' onClick={this.closeLoginModal}>
                  Close
                </FlatButton>
                <FlatButton onClick={this.onLogin}>
                  Login
                </FlatButton>
              </ModalFooter>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

Login.contextTypes = {
  router: React.PropTypes.object,
};

// Selectors
const getPresentationViewer = (state) => state.presentationViewer;

export default connect(
  (state) => {
    const presentationViewer = getPresentationViewer(state);
    return {
      // TODO: remove this once we move to redux-simple-router
      presentation: presentationViewer.presentation,
      isFetchingPresentation: presentationViewer.isFetchingPresentation,
      fetchPresentationError: presentationViewer.fetchPresentationError,
    }
  },
  {
    presentationRequest: PresentationViewerActions.presentationRequest,
    codeInputFocused: PresentationViewerActions.codeInputFocused,
  }
)(Login);
