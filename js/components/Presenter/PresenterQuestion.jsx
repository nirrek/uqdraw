import React, { Component, PropTypes } from 'react';
import Timer from '../Timer/Timer.jsx';
import FlatButton from '../FlatButton/FlatButton.jsx';
import './PresenterQuestion.scss';

export default class PresenterQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTakingResponses: false,
      timeElapsed: 0,
    }

    this.toggleTakingResponses = this.toggleTakingResponses.bind(this);
    this.handleTick = this.handleTick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.question.key !== nextProps.question.key)
      this.setState({
        isTakingResponses: false,
        timeElapsed: 0,
      });
  }

  handleTick(timeElapsed) {
    this.setState({ timeElapsed });
  }

  toggleTakingResponses() {
    this.setState(state => ({ isTakingResponses: !state.isTakingResponses }));
  }

  render() {
    const { question } = this.props;
    const { isTakingResponses, timeElapsed } = this.state;

    return (
      <div>
        <h1 className="PresenterQuestion">{question.value}</h1>

        <Timer time={timeElapsed}
               isRunning={isTakingResponses}
               onTick={this.handleTick} />

        <FlatButton onClick={this.toggleTakingResponses}>
          {`${isTakingResponses ? 'Stop' : 'Start'} Taking Responses`}
        </FlatButton>
      </div>
    );
  }
}

PresenterQuestion.propTypes = {
  question: PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
};
