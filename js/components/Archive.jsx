import React, { Component } from 'react';
import Header from './Header.jsx';
import { Link } from 'react-router';

require('../../css/components/Table.scss');
require('../../css/components/Button.scss');

export default class Archive extends Component {
  render() {
    let style = {
      display: 'flex',
      justifyContent: 'center',
    };

    return (
      <div className='ArchiveView'>
        <Header />
        <div style={style} className='MainContainer'>
          <table>
            <tr>
              <th>Course</th>
              <th>Question List</th>
              <th>Date</th>
              <th></th>
            </tr>
            <tr>
              <td>COMS3200</td>
              <td>Lecture 1</td>
              <td>14 Apr 2015</td>
              <td><Link to='responses' className='Button--unstyled'>View Responses</Link></td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}
