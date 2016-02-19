import React, { Component } from 'react';
import Logo from './Logo.jsx';
require('../../css/components/StartView.scss');

export default class StartView extends Component {
  constructor(props) {
    super(props);
    this.logoBarStyle = {
      backgroundColor: '#5C42AB',
      textAlign: 'center',
    };
    this.logoStyle = {
      color: '#fff',
    };
    this.startViewContainerStyle = {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      height: '100%',
    };
    this.startViewStyle = {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      margin: 'inherit 10vw',
    };
    this.dividerStyle = {
      container: {
        width: '100%',
        height: 1,
        backgroundColor: '#e0e0e0',
        display: 'flex',
        justifyContent: 'center',
      },
      label: {
        backgroundColor: '#F7FAFE',
        marginTop: '-0.5em',
        lineHeight: '1',
        padding: '0 .5em',
        fontSize: 22,
        fontWeight: 600,
        color: '#ddd',
        letterSpacing: '-2px',
      }
    };
    this.sectionStyle = {
      flexGrow: 1,
      textAlign: 'center',
      padding: '1rem 0',
    };

    this.state = {
      codeInput1: '',
      codeInput2: '',
      codeInput3: '',
      usernameInput: '',
      passwordInput: '',
    };
  }

  onChangeInput1(event) {
    let inputValue = event.target.value;
    if (inputValue.length > 1)   return; // max 1 char
    if (inputValue.length === 1) this.refs.in2.focus();
    this.setState({'codeInput1': inputValue});
  }
  onChangeInput2(event) {
    let inputValue = event.target.value;
    if (inputValue.length > 1)   return; // max 1 char
    if (inputValue.length === 1) this.refs.in3.focus();
    this.setState({'codeInput2': inputValue});
  }
  onChangeInput3(event) {
    let inputValue = event.target.value;
    if (inputValue.length > 1)   return; // max 1 char
    if (inputValue.length === 1) {
      // validate that all inputs are filled.
      this.context.router.push('drawing');
    }
    this.setState({'codeInput3': inputValue});
  }

  onLogin(event) {
    event.preventDefault();
    const username = 'uqjstee8'; // TODO make programmatic
    this.context.router.push(`welcome/${username}`);
  }

  render() {
    return (
      <div className='StartView-Container' style={this.startViewContainerStyle}>
        <div className='LogoBar' style={this.logoBarStyle}>
          <Logo logoStyle={this.logoStyle} />
        </div>

        <div ref='StartView' className='MainContainer' style={this.startViewStyle}>
          <div className='topSection' ref='topSection' style={this.sectionStyle}>
            <h1 className='CodeHeading'>Enter Presenter&apos;s Code</h1>
            <div className='CodeSubheading'>(shown on presenter&apos;s screen)</div>
            <div className='CodeInputter'>
              <form>
                <input ref='in1' className='CodeInput' type='text' value={this.state.codeInput1}
                       onChange={this.onChangeInput1.bind(this)}/>
                <input ref='in2' className='CodeInput' type='text' value={this.state.codeInput2}
                       onChange={this.onChangeInput2.bind(this)}/>
                <input ref='in3' className='CodeInput' type='text' value={this.state.codeInput3}
                       onChange={this.onChangeInput3.bind(this)}/>
              </form>
            </div>
          </div>
          <div ref='divider' style={this.dividerStyle.container}>
            <div ref='label' style={this.dividerStyle.label}> OR </div>
          </div>
          <div ref='bottomSection' style={this.sectionStyle}>
            <h3>Login as Presenter</h3>
            <form className='LoginForm'>
              <div className='Slat Slat--unpadded'>
                <input className='Input Input--first' type="text" placeholder="Username"/>
              </div>
              <div className='Slat Slat--unpadded'>
                <input className='Input Input--last' type="password" placeholder="Password"/>
              </div>
              <div className='Slat'>
                <button onClick={this.onLogin.bind(this)} className='Button Button--primary'>Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

// Set Router Context to allow for programatically transitioning to new routes.
// See: https://github.com/rackt/react-router/blob/master/docs/api/RouterContext.md
StartView.contextTypes = {
  router: React.PropTypes.object,
};
