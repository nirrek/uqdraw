import React, { Component, PropTypes } from 'react';
import cn from 'classnames';
import './PresenterQuestionSelector.scss';

export default class QuestionSelector extends Component {
  render() {
    const { questions, currentQuestion, onSelect } = this.props;
    const currentId = currentQuestion ? currentQuestion.id : '';

    return (
      <div className='QuestionSelector'>
        {questions.map(({ id }, idx) => {
          const classList = cn({
            'QuestionSelector-item': true,
            'QuestionSelector-item--active': id === currentId,
          });

          return (
            <div key={id}
                 className={classList}
                 onClick={() => onSelect(id)}>
              Question {idx + 1}
            </div>
          );
        })}
      </div>
    );
  }
}

QuestionSelector.propTypes = {
  questions: PropTypes.array.isRequired,
  currentQuestion: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
};
