import React, { Component } from 'react';
import Header from '../Header/Header.jsx';
import Firebase from 'firebase';
import config from '../../config.js';
import './Responses.scss';

// entityMapToArray :: Object<String, Object> -> [Object]
// Converts a map of entities (keyed by the entity's key) into an array of
// entities in which the key is a property of the entity.
const entityMapToArray = (map) =>
  Object.entries(map).reduce((acc, [key, entity]) => {
    acc.push({ ...entity, key });
    return acc;
  }, []);

const responsesMapToArray = (responses) =>
  entityMapToArray(responses)
    .map(entity => {
      entity.uri = entity.submissionDataURI;
      delete entity.submissionDataURI;
      return entity;
    });

export default class Responses extends Component {
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
    // TODO make this programmatic based upon router parameters.
    this.responsesRef =
      new Firebase(`${config.firebase.base}/presentations/3fa/responses`);

    this.responsesRef.on('value', snapshot => {
      const responses = snapshot.val() || {};
      this.setState({ responses: responsesMapToArray(responses) });
    });
  }

  render() {
    const { responses } = this.state;

    return (
      <div>
        <Header />
        <div className='MainContainer'>
          <div className='Responses'>
            <h2 className='Responses-heading'>Responses</h2>
            <div className='Responses-thumbnailContainer'>
              {responses.map(({ key, uri }) =>
                <img key={key}
                     width='250'
                     className='Responses-thumbnail'
                     src={uri} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
