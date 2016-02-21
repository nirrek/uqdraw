import React, { Component, PropTypes } from 'react';
import './PresenterResponses.scss';

export default class PresenterResponses extends Component {
  handleClick(event, key) {
    event.preventDefault();
    this.props.onThumbnailClick(key);
  }

  render() {
    const { responses } = this.props;
    console.log('RESPONSES', responses);

    const thumbnails = Object.entries(responses).map(([key, response]) => (
      <a key={key} onClick={event => this.handleClick(event, key)}>
        <img className='PresenterResponses-thumbnail' src={response.imageURI} />
      </a>
    ));

    return (
      <div className='PresenterResponses'>
        <div  className='PresenterResponses-thumbnailList'>
          {thumbnails}
        </div>
      </div>
    );
  }
}

PresenterResponses.propTypes = {
  onThumbnailClick: PropTypes.func.isRequired,
  responses: PropTypes.object.isRequired,
};
