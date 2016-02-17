import React, { Component } from 'react';

export default class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elapsed: 0,
    };
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.tick = this.tick.bind(this);
  }

  startTimer() {
    if (!this.timer) {
      this.timer = setInterval(this.tick, this.props.interval);
    }
  }

  stopTimer() {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  resetTimer() {
    this.stopTimer();
    this.setState({elapsed: 0});
  }

  tick() {
    this.setState({elapsed: Number(this.state.elapsed) + +Number(this.props.increment)});
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  render() {
    this.styles = {
      container: {
        fontSize: 30,
      }
    };
    let totalSeconds = Math.round(this.state.elapsed / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    if (seconds < 10) { seconds = '0' + seconds; }
    return (
      <div style={this.styles.container}>
        <span>{minutes}:{seconds}</span>
      </div>
    );
  }
}
