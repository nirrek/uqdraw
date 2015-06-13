describe('API Integration', function() {
  var Firebase = require('firebase');
  var FirebaseServer = require('firebase-server');
  var server;

  beforeAll(function() {
    server = new FirebaseServer(5000, 'test.firebaseio.com', {
        states: {
            CA: 'California',
            AL: 'Alabama',
            KY: 'Kentucky'
        }
    });
  });

  it('the callback is invoked before timeout', function(done) {
    var client = new Firebase('ws://test.firebaseio.com:5000');
    client.on('value', function(snap) {
        console.log('Got value: ', snap.val());
        done();
    });
  });

});



