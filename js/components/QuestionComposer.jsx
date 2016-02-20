import React, { Component } from 'react';
import cn from 'classnames';
import Button from './Button/Button.jsx';
import Modal from './Modal/Modal.jsx';
import '../../styles/components/QuestionManager.scss';

export default class QuestionComposer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: ''
    };
    this.onTextareaChange = this.onTextareaChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onTextareaChange(event) {
    this.setState({ inputText: event.target.value });
  }

  onSave() {
    this.props.onSave(this.state.inputText);
    this.setState({ inputText: '' });
  }

  render() {
    const { isOpen, onClose } = this.props;

    const labelClass = cn('TransparentLabel', {
      'TransparentLabel--hidden': this.state.inputText.length
    });

    return (
      <Modal isOpen={isOpen} onClose={onClose} modalStyles={styles.modal}>
        <div className='QuestionInput'>
          <div className='AdvancedInput'>
            <div className={labelClass}>Enter Question Here</div>
            <textarea onChange={this.onTextareaChange} value={this.state.inputText} />
          </div>
        </div>
        <a href="#">Insert supporting image &rarr;</a>
        <div className='Modal__footer'>
          <Button onClick={this.onSave}>Save Question</Button>
        </div>
      </Modal>
    );
  }
}

const styles = {
  modal: { marginTop: -272 }
};

QuestionComposer.propTypes = {
    isOpen: React.PropTypes.bool,
    onClose: React.PropTypes.func,
    onSave: React.PropTypes.func,
};
