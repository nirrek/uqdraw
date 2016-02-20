import React, { Component } from 'react';
import Touchy from '../touchy.js';
let Spinner = require('react-spinkit');
import Button from './Button/Button.jsx';

require('../../styles/components/Drawing.scss');
require('../../styles/components/Button.scss');

export default class Drawing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEraserActive: false,
      lineWidth: 'm',
      isFullscreen: false,
    };
    this.ctx = undefined; // drawing canvas context
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

    // Setup the presentation canvas
    let displayCanvas = this.refs.displayCanvas;
    let displayCtx = displayCanvas.getContext('2d');
    this.displayCanvas = displayCanvas; // need access for saving img
    this.displayCtx = displayCtx;

    // Setup the drawing canvas that will actually capture the drawing input
    // before transferring it to the presentation canvas
    var canvas = document.querySelector('#canvas');
    var ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.ctx = ctx; // put on the React Component so methods can access it

    this.initializeCanvases();
    this.initializeTouchy();  // sets up touch event handling for drawing input.
  }

  componentWillUnmount() {
    // TODO: probably memory leaks from the Touchy event handlers
    document.body.classList.remove('noScrollOnOverflow');
  }

  initializeCanvases() {
    // Canvases have to have their widths hard-set to prevent distortion
    // through scaling.
    this.setCanvasWidths();

    this.setLineWidth('m');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#333333';
  }

  computeMidpoint(point1, point2) {
    var midpoint = {
      x: (point1.x + point2.x) / 2,
      y: (point1.y + point2.y) / 2,
    };
    return midpoint;
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
        var mid = this.computeMidpoint(point1, point2);
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

    var toucher = Touchy(this.canvas, true, (hand, finger) => {
      this.fingerTouchedScreen(hand, finger, this.displayCtx, this.ctx, this.canvas);
    });
  }

  setCanvasWidths() {
    // Must set DOM properties, as CSS styling will distory otherwise.
    this.displayCanvas.width = parseInt(getComputedStyle(this.displayCanvas).width, 10);
    this.displayCanvas.height = parseInt(getComputedStyle(this.displayCanvas).height, 10);
    this.canvas.width = this.displayCanvas.width;
    this.canvas.height = this.displayCanvas.height;
  }

  toggleEraser() {
    if (!this.state.isEraserActive) this.ctx.strokeStyle = '#F7FAFE';
    else                           this.ctx.strokeStyle = '#333333';
    this.setState({ isEraserActive: !this.state.isEraserActive });
  }

  // Sets the line width for the canvas and stores the state on the component
  setLineWidth(size) { // size is 's' | 'm' | 'l'
    let lineWidth;
    if (size === 's') lineWidth = 3;
    if (size === 'm') lineWidth = 5;
    if (size === 'l') lineWidth = 10;
    this.ctx.lineWidth = lineWidth;

    this.setState({
      lineWidth: size
    });
  }

  // Cycles the line width to the next size in the list.
  cycleLineWidth() {
    if      (this.state.lineWidth === 's') this.setLineWidth('m');
    else if (this.state.lineWidth === 'm') this.setLineWidth('l');
    else if (this.state.lineWidth === 'l') this.setLineWidth('s');
  }

  // Submit the current canvas
  onSubmitImage() {
    let dataURL = this.displayCanvas.toDataURL(); // canvas encoded as dataURI
    this.props.onSubmitImage(dataURL);
  }

  hideQuestion() {
    this.setState({ isQuestionOpen: false });
  }

  fullscreen() {
    this.refs.root.webkitRequestFullscreen();
    this.setState({ isFullscreen: true });
  }

  render() {
    let markup;
    var eraserStyle = {};
    if (this.state.isEraserActive)
      eraserStyle = { backgroundImage: 'url(../../images/eraser-active.svg)' };

    var activeStyle = {backgroundColor: '#fff'};
    var smallStyle = (this.state.lineWidth === 's') ? activeStyle : {};
    var mediumStyle = (this.state.lineWidth === 'm') ? activeStyle : {};
    var largeStyle = (this.state.lineWidth === 'l') ? activeStyle : {};

    if (this.state.isFullscreen)
      var fullscreenStyle = {display: 'none'};

    if (this.props.isSubmitting)
      var loadingIndicator = <Spinner spinnerName='double-bounce' noFadeIn />;

    return (
      <div ref="root">
        <div onClick={this.fullscreen.bind(this)} className='fullscreen' style={fullscreenStyle}></div>
        <canvas key='displayCanvas' ref='displayCanvas' id='displayCanvas'></canvas>
        <canvas key='canvas' ref='canvas' id='canvas'></canvas>

        <div className='ActionBar'>
          <div onClick={this.toggleEraser.bind(this)} className='Action Action--eraser'>
            <div style={eraserStyle} className='Action-icon'></div>
          </div>
          <div className='Action Action--submit'>
            <Button type='unstyled' onClick={this.onSubmitImage.bind(this)}>
              Submit Answer
            </Button>
            {loadingIndicator}
          </div>
          <div onClick={this.cycleLineWidth.bind(this)} className='Action Action--strokeWidth'>
            <div className='BrushSizeIcon'>
              <div style={smallStyle} className='BrushSize BrushSize-small'></div>
              <div style={mediumStyle} className='BrushSize BrushSize-medium'></div>
              <div style={largeStyle} className='BrushSize BrushSize-large'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Drawing.propTypes = {
  onSubmitImage: React.PropTypes.func,
  isSubmitting: React.PropTypes.bool,
};
