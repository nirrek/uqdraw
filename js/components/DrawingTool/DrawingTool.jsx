import React, { Component, PropTypes } from 'react';
import Touchy from './touchy.js';
import ActionBar from './ActionBar.jsx';
import { pens } from './PenSelector.jsx';
import './DrawingTool.scss';

// Produces the midpoint between two 2D points.
const midpoint = (point1, point2) => ({
  x: (point1.x + point2.x) / 2,
  y: (point1.y + point2.y) / 2,
});

const dimensions = (node) => {
  const { width, height } = window.getComputedStyle(node);
  return {
    width: parseInt(width, 10),
    height: parseInt(height, 10),
  };
};

const setDimensionDOMAttributes = (node, dimensions) => {
  node.width = dimensions.width;
  node.height = dimensions.height;
};

export default class DrawingTool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEraserActive: false,
      pen: pens.medium,
    };

    this.ctx = undefined; // drawing canvas context

    this.submitImage = this.submitImage.bind(this);
    this.handleEraserToggle = this.handleEraserToggle.bind(this);
    this.handlePenSelect = this.handlePenSelect.bind(this);
  }

  componentDidMount() {
    // prevents 'pull-to-refresh' on mobile browsers firing while drawing.
    document.body.classList.add('noScrollOnOverflow');

    this.refs.root.addEventListener('webkitfullscreenchange', () => {
      // Need to reinit state after fullscreen, chrome is losing state all over
      // the place. No description of what they are doing.
      setTimeout(() => {
        this.initializeCanvases();
        this.initializeTouchy();
      }, 1000); // t/o required as event is fired before it is fullscreened.
    });

    // Make display canvas references available on the component instance.
    this.displayCanvas = this.refs.displayCanvas;  // used to save the img
    this.displayCtx = this.displayCanvas.getContext('2d');

    // Setup the drawing canvas that will actually capture the drawing input
    // before transferring it to the presentation canvas
    this.canvas = this.refs.canvas;
    this.ctx = this.canvas.getContext('2d');

    this.initializeCanvases();
    this.initializeTouchy();  // sets up touch event handling for drawing input.
  }

  componentWillUnmount() {
    // TODO: probably memory leaks from the Touchy event handlers
    document.body.classList.remove('noScrollOnOverflow');
  }

  initializeCanvases() {
    // Once initial layout has been computed, we need to hard set the canvas
    // dimensions as DOM attributes to prevent canvas distortion on resizing.
    const canvasDimensions = dimensions(this.refs.canvasContainer);
    setDimensionDOMAttributes(this.displayCanvas, canvasDimensions);
    setDimensionDOMAttributes(this.canvas, canvasDimensions);

    this.ctx.lineWidth = this.state.pen.width;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#333333';
  }

  fingerTouchedScreen(hand, finger, displayCtx, ctx, canvas) {
    var points = this.points;
    if (hand.fingers.length > 1) return; // only deal with single finger.

    // Setup event listeners for the finger that caused the event firing.
    finger.on('start', (point) => {
      points = [];
      points.push(point);
    });

    // Wiping version
    finger.on('move', (point) => {
      points.push(point);

      // Wipe the canvas clean on each move event, allows making single path
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Starting two points of the path.
      var point1 = points[0];
      var point2 = points[1];

      // Begin the path creation.
      ctx.beginPath();
      ctx.moveTo(point1.x, point1.y);

      // Add all points to the bath using quadratic bezier
      for (var i = 1; i < points.length; i++) {
        // Make path end be the midpoint, with control point at p1.
        var mid = midpoint(point1, point2);
        ctx.quadraticCurveTo(point1.x, point1.y, mid.x, mid.y);
        point1 = points[i];
        point2 = points[i+1];
      }

      // Last point as straight line for now, next move event will smooth it.
      ctx.lineTo(point1.x, point1.y);
      ctx.stroke();
    });

    finger.on('end', (point) => {
      // Transfer image from drawing to display canvas + clear drawing canvas.
      displayCtx.drawImage(canvas, 0, 0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    });
  }

  initializeTouchy() {
    this.points = []; // list of all touch points in the current movement

    Touchy(this.canvas, true, (hand, finger) => {
      this.fingerTouchedScreen(hand, finger, this.displayCtx, this.ctx, this.canvas);
    });
  }

  handleEraserToggle() {
    this.ctx.strokeStyle = this.state.isEraserActive ? '#333333' : '#F7FAFE';
    this.setState({ isEraserActive: !this.state.isEraserActive })
  }

  handlePenSelect(pen) {
    this.ctx.lineWidth = pen.width;
    this.setState({ pen });
  }

  // Submit the current canvas
  submitImage() {
    this.props.onSubmitImage(this.displayCanvas.toDataURL());
  }

  render() {
    return (
      <div className='DrawingTool' ref="root">
        <div ref='canvasContainer' className='DrawingTool-canvasContainer'>
          <canvas key='displayCanvas'
                  ref='displayCanvas'
                  className='DrawingTool-displayCanvas' />
          <canvas key='canvas'
                  ref='canvas'
                  className='DrawingTool-canvas' />
        </div>
        <ActionBar
          currentPen={this.state.pen}
          isEraserActive={this.state.isEraserActive}
          onEraserToggle={this.handleEraserToggle}
          onPenSelect={this.handlePenSelect}
          hasSubmitted={this.props.hasSubmitted}
          onSubmit={this.submitImage}
          isSubmitting={this.props.isSubmitting} />
      </div>
    );
  }
}

DrawingTool.propTypes = {
  hasSubmitted: PropTypes.bool,
  onSubmitImage: PropTypes.func,
  isSubmitting: PropTypes.bool,
};
