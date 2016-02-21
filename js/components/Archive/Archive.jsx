import React, { Component } from 'react';
import { Link } from 'react-router';
import Header from '../Header/Header.jsx';
import LinkButton from '../LinkButton/LinkButton.jsx';
import '../../../styles/components/Table.scss';
import './Archive.scss';

export default class Archive extends Component {
  render() {
    return (
      <div className='ArchiveView'>
        <Header />
        <div className='MainContainer ArchiveContainer'>
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Question List</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>COMS3200</td>
                <td>Lecture 1</td>
                <td>14 Apr 2015</td>
                <td>
                  <LinkButton to='responses' type='unstyled'>
                    View Responses
                  </LinkButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
