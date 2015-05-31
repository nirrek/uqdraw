import React from 'react';
import Question from './Question.jsx';
import {Button} from './UI.jsx';
let Modal = require('react-modal');
require('../../css/components/QuestionManager.scss');

// A component that allows a lecturer to compose a new question, or to edit
// and existing one.
class QuestionComposer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: ''
    };
  }

  onTextareaChange(event) {
    let inputText = event.target.value;
    let inputHasText = true;
    if (inputText.length === 0) { inputHasText = false; }
    this.setState({
      question: event.target.value,
      inputHasText: inputHasText,
    });
  }

  onSave() {
    this.props.onSave(this.state.question);
    this.setState({question: '', inputHasText: false});
  }

  render() {
    let {isOpen, onClose} = this.props;
    let labelClass = 'TransparentLabel';
    if (this.state.inputHasText) {labelClass += ' TransparentLabel--hidden'; }

    return (
      <Modal className='Modal--questionComposer' isOpen={isOpen}>
        <a onClick={onClose} href="#" className='Modal__cross'>&times;</a>
        <div className='QuestionInput'>
          <div className='AdvancedInput'>
            <div className={labelClass}>Enter Question Here</div>
            <textarea onChange={this.onTextareaChange.bind(this)} value={this.state.question} />
          </div>
        </div>
        <a href="#">Insert supporting image &rarr;</a>
        <div className='Modal__footer'>
          <Button onClick={this.onSave.bind(this)}>Save Question</Button>
        </div>
      </Modal>
    );
  }
}

QuestionComposer.propTypes = {
    isOpen: React.PropTypes.bool,
    onClose: React.PropTypes.func,
    onSave: React.PropTypes.func,
};

export default QuestionComposer;
