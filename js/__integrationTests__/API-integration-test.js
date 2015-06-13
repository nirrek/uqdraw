var expect = require('expect.js');

describe('API Integration', function() {
  var Firebase = require('firebase');
  var FirebaseServer = require('firebase-server');
  var server;

  before(function() {
    server = new FirebaseServer(5000, 'test.firebaseio.com', {});
  });

  describe('Empty Firebase', function() {
    var client; // Firebase client used in each spec.

    before(function(done) {
      var fbClient = new Firebase('ws://test.firebaseio.com:5000');

      // Empty out the Firebase
      fbClient.set(null, function(error) {
        if (error) return console.log(error);
        done();
      });
    });

    afterEach(function() {
      client.off();
      client = null;
    });

    it('is empty to begin', function(done) {
      client = new Firebase('ws://test.firebaseio.com:5000');
      client.on('value', function(snapshot) {
        var data = snapshot.val();
        expect(data).to.be(null);
        done();
      });
    });
  });

  describe('Prepopulated Firebase', function() {
    var client; // Firebase client used in each spec.

    before(function(done) {
      var fbClient = new Firebase('ws://test.firebaseio.com:5000');
      var data = {
        courseLists: {
          uqjstee8: {
            '-JlUd0xRBkwULfuGFGqo': 'COMS3200',
            '-JldDBERX2jaTHTanV-P': 'INFS3202',
            '-Jli22md1TMXq7YhqMHd': 'DECO3800',
          }
        }
      };

      // Populate the Firebase with the data
      fbClient.set(data, function(error) {
        if (error) return console.log(error);
        done();
      });
    });

    afterEach(function() {
      client.off();
      client = null;
    });

    it('finds all the subjects', function(done) {
      var isInitialNullPayload = true;
      client = new Firebase('ws://test.firebaseio.com:5000/courseLists');

      client.on('value', function(snapshot) {
        // The initial payload sent is a null payload. Filter this out.
        if (isInitialNullPayload) {
          isInitialNullPayload = false;
          return;
        }

        var data = snapshot.val();

        expect(data).to.eql({
          uqjstee8: {
            '-JlUd0xRBkwULfuGFGqo': 'COMS3200',
            '-JldDBERX2jaTHTanV-P': 'INFS3202',
            '-Jli22md1TMXq7YhqMHd': 'DECO3800',
          }
        });

        done();
      });
    });
  });

});



