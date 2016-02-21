import React, { Component, PropTypes } from 'react';
import './Timer.scss';

function toMinutesAndSeconds(ms) {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return [
    minutes,
    seconds,
  ];
}

export default class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elapsed: 0,
    };
    // this.startTimer = this.startTimer.bind(this);
    // this.stopTimer = this.stopTimer.bind(this);
    // this.resetTimer = this.resetTimer.bind(this);
    this.tick = this.tick.bind(this);

    if (props.isRunning) this.startTimer();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.isRunning) this.startTimer();
    else                     this.stopTimer();
  }

  startTimer() {
    if (!this.timer) {
      this.timer = setInterval(this.tick, this.props.tickInterval);
    }
  }

  stopTimer() {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  // resetTimer() {
  //   this.stopTimer();
  //   this.setState({ elapsed: 0 });
  // }

  tick() {
    // this.setState({ elapsed: this.state.elapsed + this.props.tickInterval });
    const elapsedTime = this.props.time + this.props.tickInterval;
    this.props.onTick(elapsedTime);
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  render() {
    let [minutes, seconds] = toMinutesAndSeconds(this.props.time);
    if (seconds < 10) seconds = `0${seconds}`;
    return (
      <div className="Timer">
        <span>{minutes}:{seconds}</span>
      </div>
    );
  }
}

Timer.propTypes = {
  isRunning: PropTypes.bool.isRequired,
  tickInterval: PropTypes.number, // period in ms
  onTick: PropTypes.func.isRequired,
  time: PropTypes.number.isRequired,
};

Timer.defaultProps = {
  tickInterval: 1000,
};
