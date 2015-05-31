import React from 'react';
import Header from './Header.jsx';
let Firebase = require('firebase');
import config from '../config.js';

class Responses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      responses: [], // array of lecture responses
    };
  }

  componentDidMount() {
    this.observeFirebaseResponses();
  }

  observeFirebaseResponses() {
    this.responsesRef = new Firebase(`${config.firebase.base}/presentations/3fa/responses`);
    this.responsesRef.on('value', (snapshot) => {
      let responses = snapshot.val() || {};
      responses = Object.keys(responses).map((key) => {
        return responses[key].submissionDataURI;
      });
      this.setState({ responses });
    });
  }

  render() {
    let style = {
      maxWidth: 800,
      display: 'flex',
      alignItems: 'flex-start',
      margin: '0 auto',
      flexDirection: 'column',
    };

    let thumbStyle = {
      marginRight: '1em',
      marginBottom: '1em',
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      borderRadius: 4,
    };

    let thumbContainerStyle = {
      display: 'flex',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    };

    let thumbnails = this.state.responses.map((uri) => {
      return <img width='250' style={thumbStyle} src={uri} />;
    });

    return (
      <div className='ResponsesView'>
        <Header />
        <div className='MainContainer'>
          <div style={style} className='Responses'>
            <h2 style={{display: 'block'}}>Responses</h2>
            <div style={thumbContainerStyle}>
              {thumbnails}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Responses;
