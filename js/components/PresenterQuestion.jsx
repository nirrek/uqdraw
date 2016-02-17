import React, { Component } from 'react';

export default class PresenterQuestion extends Component {
  constructor(props) {
    super(props);
    this.styles = {
      unselected: {
        fontSize: '0.5em',
        fontStyle: 'italic',
      },
    };

    this.state = {
      takingQuestions: false,
      styles: this.styles,
    };
  }

  render() {
    if (!this.props.question) {
      return (
        <h2 className='Tip' /*style={this.styles.unselected}*/>
          Select a question on the right when you are ready to begin.
        </h2>
      );
    }

    return (
      <div>
        <h1 className='Question'>{this.props.question.value}</h1>
      </div>
    );
  }
}

PresenterQuestion.propTypes = {
  question: React.PropTypes.shape({
    key: React.PropTypes.string,
    value: React.PropTypes.string,
  }),
};
