import React from 'react';
let objectAssign = require('object-assign');

class Drawing extends React.Component {
  componentDidMount() {
    // gets the midpoint between two points
    function computeMidpoint(point1, point2) {
      var midpoint = {
        x: (point1.x + point2.x) / 2,
        y: (point1.y + point2.y) / 2,
      };
      return midpoint;
    }

    // Event handler for a finger touching the screen
    var points; // list of all touch points in the current movement

    function fingerTouchedScreen(hand, finger, displayCtx, ctx, canvas) {
      if (hand.fingers.length > 1) return; // only deal with single finger.

      // Setup event listeners for the finger that caused the event firing.
      finger.on('start', function(point) {
        console.log('start\n');
        points = [];
        points.push(point);
      });

      // Wiping version
      finger.on('move', function(point) {
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
          var mid = computeMidpoint(point1, point2);
          ctx.quadraticCurveTo(point1.x, point1.y, mid.x, mid.y);
          point1 = points[i];
          point2 = points[i+1];
        }

        // Last point as straight line for now, next move event will smooth it.
        ctx.lineTo(point1.x, point1.y);
        ctx.stroke();
      });

      finger.on('end', function(point) {
        // Transfer image from drawing to display canvas + clear drawing canvas.
        displayCtx.drawImage(canvas, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        console.log('\n');
        console.log('end\n');
      });
    }

    // ------------------------------------------------------------------------
    // Main Initialization Logic
    // ------------------------------------------------------------------------
    // Setup the presentation canvas
    var displayCanvas = document.querySelector('#displayCanvas');
    var displayCtx = displayCanvas.getContext('2d');
    // Must set DOM properties, as CSS styling will distory otherwise.
    displayCanvas.width = parseInt(getComputedStyle(displayCanvas).width, 10);
    displayCanvas.height = parseInt(getComputedStyle(displayCanvas).height, 10);
    window.displayCtx = displayCtx; // expose for debugging
    window.displayCanvas = displayCanvas;

    // Setup the drawing canvas that will actually capture the drawing input
    // before transferring it to the presentation canvas
    var canvas = document.querySelector('#canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = displayCanvas.width;
    canvas.height = displayCanvas.height;

    // setup canvas
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#333333';


    // Starts listening:  Touchy(objectToListOn, pickupMouseEventsToo, cb);
    var toucher = Touchy(canvas, true, function(hand, finger) {
      fingerTouchedScreen(hand, finger, displayCtx, ctx, canvas);
    });
  }

  render() {
    return (
      <div className='Drawing'>
        <canvas id='displayCanvas'></canvas>
        <canvas id='canvas'></canvas>
      </div>
    );
  }
}


export default Drawing;
