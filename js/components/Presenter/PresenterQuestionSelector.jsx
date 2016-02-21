import React, { Component } from 'react';
import cn from 'classnames';
import './PresenterQuestionSelector.scss';

export default class QuestionSelector extends Component {
  render() {
    const { questions, activeQuestionKey, onActivateQuestion } = this.props;

    return (
      <div className='QuestionSelector'>
        {questions.map(({ key }, idx) => {
          const classList = cn({
            'QuestionSelector-item': true,
            'QuestionSelector-item--active': key === activeQuestionKey,
          });

          return (
            <div key={key}
                 className={classList}
                 onClick={() => onActivateQuestion(key)}>
              Question {idx + 1}
            </div>
          );
        })}
      </div>
    );
  }
}
