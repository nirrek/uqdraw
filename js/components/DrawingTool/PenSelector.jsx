import React, { Component, PropTypes } from 'react';
import Clickable from '../Clickable/Clickable.jsx';
import cn from 'classnames';
import './PenSelector.scss';

export const pens = {
  small: {
    width: 3, // in px
  },
  medium: {
    width: 5,
  },
  large: {
    width: 10,
  }
};

const penCycleOrder = [pens.small, pens.medium, pens.large];

const nextPen = (cycleOrder, curPen) => {
  const idx = cycleOrder.indexOf(curPen);
  const nextIdx = (idx + 1) % cycleOrder.length;
  return cycleOrder[nextIdx];
}

export default class BrushSelector extends Component {
  render() {
    const { pen, onPenSelect } = this.props;
    const handleClick = () => onPenSelect(nextPen(penCycleOrder, pen));

    return (
      <Clickable className='PenSelector' onClick={handleClick}>
        <div className='PenSelector-pens'>
          {Object.keys(pens).map(penName => (
            <div key={penName} className={cn({
              'PenSelector-pen': true,
              [`PenSelector-pen--${penName}`]: true,
              'PenSelector-pen--active': pens[penName] === pen,
            })} />
          ))}
        </div>
      </Clickable>
    );
  }
}

BrushSelector.propTypes = {
  pen: PropTypes.object.isRequired,
  onPenSelect: PropTypes.func.isRequired,
};
