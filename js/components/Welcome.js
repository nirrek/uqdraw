import React from 'react';
import { Link } from 'react-router';

class Grid extends React.Component {
  render() {
    var style = this.props.style || {};
    var classes = this.props.className || '';
    classes += 'Grid';
    if (this.props.center) classes += ' Grid--center';
    if (this.props.gutters) classes += ' Grid--gutters';
    return (
      <div style={style} className={classes}>
        {this.props.children}
      </div>
    );
  }
}

class Cell extends React.Component {
  render() {
    var style = this.props.style || {};
    var classes = this.props.className || '';
    classes += ' Grid-cell';
    if (this.props.center) classes += ' Grid-cell--center';
    if (this.props.bottom) classes += ' Grid-cell--bottom';
    return (
      <div style={style} className={classes}>
        {this.props.children}
      </div>
    );
  }
}

class Welcome extends React.Component {
  render() {
    return (
      <div className='WelcomeView'>
        <Grid center='true' gutters='true'>
          <Cell>
            <h1> Welcome, professor! </h1>
          </Cell>
        </Grid>
        <Grid>
          <Cell>
            Select the course the questions are for, or add a new course below.
          </Cell>
        </Grid>
        <Grid style={{minHeight: '10em'}}>
          <Cell />
          <Cell center='true'>
            <Link className='CourseLink' to='questionManager'>COMS3200</Link>
            <Link className='CourseLink' to='questionManager'>COMS3200</Link>
          </Cell>
          <Cell />
        </Grid>
      </div>
    );
  }
}

export default Welcome;
