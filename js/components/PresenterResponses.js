import React from 'react';

class PresenterResponses extends React.Component {

  onThumbnailClick(key, event) {
    event.preventDefault();
    this.props.onThumbnailClick(key);
  }

  render() {
    this.styles = {
      container: {
        textAlign: 'center',
        color: '#ccc',
        justifyContent: 'center',
      },
      responses: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: 20,
        marginRight: 10,
      },
      response: {
        marginRight: 10,
      },

    };
    // if (!this.props.responses.count) return (<div/>);
    let thumbnails = this.props.responses.map((dataURI, key) => {
      return (
        <a key={key} href="" onClick={this.onThumbnailClick.bind(this, key)}>
          <img className='Thumbnail' src={dataURI}/>
        </a>
      );
    });
    return (
      <div style={this.styles.container}>
        <div style={this.styles.responses}>{thumbnails}</div>
      </div>
    );
  }
}

export default PresenterResponses;
