import React from 'react';
import { Link } from 'react-router';

class Grid extends React.Component {
  render() {
    var style = this.props.style || {};
    var classes = this.props.className || '';
    classes += ' Grid';
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
      <div className='Welcome'>
        <header>
          <div className='Logo'>
            <span className="Pencil"></span>
            <span className="Name">UQDraw</span>
          </div>
        </header>
        <div className='Marquee'>
          <h1 className='Heading'>Welcome, Lecturer.</h1>
          <div className="Subheading">Select the course the questions are for below, or add a new course.</div>
        </div>

        <Grid className="SubjectList">
          <Cell style={{
            maxWidth: 610,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
            <Link className='ListItem' to='questionManager'>COMS3200</Link>
            <Link className='ListItem' to='questionManager'>COMS3200</Link>
            <Link className='ListItem' to='questionManager'>COMS3200</Link>
            <Link className='ListItem' to='questionManager'>COMS3200</Link>
            <Link className='ListItem' to='questionManager'>COMS3200</Link>
            <Link className='ListItem' to='questionManager'>COMS3200</Link>
            <Link className='ListItem' to='questionManager'>COMS3200</Link>
            <div className="ListItem ListItem--outline">
              <i className='Icon--plus'></i>Add Course
            </div>

          </Cell>
        </Grid>
      </div>
    );
  }
}

export default Welcome;
