import React, { Component, PropTypes } from 'react';
import Timer from '../Timer/Timer.jsx';
import FlatButton from '../FlatButton/FlatButton.jsx';
import './PresenterQuestion.scss';

export default class PresenterQuestion extends Component {
  constructor(props) {
    super(props);
    this.toggleTakingResponses = this.toggleTakingResponses.bind(this);
    this.handleTick = this.handleTick.bind(this);
  }

  handleTick(timeElapsed) {
    this.props.onTimerTick(timeElapsed);
  }

  toggleTakingResponses() {
    if (this.props.isAcceptingResponses) this.props.onStopAcceptingResponses();
    else                                 this.props.onStartAcceptingResponses();
  }

  render() {
    const { question, timeElapsed, isAcceptingResponses } = this.props;

    return (
      <div>
        <h1 className="PresenterQuestion">{question.text}</h1>

        <Timer time={timeElapsed}
               isRunning={isAcceptingResponses}
               onTick={this.handleTick} />

        <FlatButton onClick={this.toggleTakingResponses}>
          {`${isAcceptingResponses ? 'Stop' : 'Start'} Taking Responses`}
        </FlatButton>
      </div>
    );
  }
}

PresenterQuestion.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  onStartAcceptingResponses: PropTypes.func,
  onStopAcceptingResponses: PropTypes.func,
  isAcceptingResponses: PropTypes.bool,
  timeElapsed: PropTypes.number,
  onTimerTick: PropTypes.func,
};
