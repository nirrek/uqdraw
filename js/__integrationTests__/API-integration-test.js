describe('API Integration', function() {
  var Firebase = require('firebase');
  var FirebaseServer = require('firebase-server');
  var server;

  // Used to launch a Firebase with an empty document
  var launchEmptyServer = function() {
    return new FirebaseServer(5000, 'test.firebaseio.com', {});
  };

  // Used to launch a Firebase with a standard-looking document
  var launchPrepopulatedServer = function() {
    return new FirebaseServer(5000, 'test.firebaseio.com', {
      courseLists: {
        uqjstee8: {
          '-JlUd0xRBkwULfuGFGqo': 'COMS3200',
          '-JldDBERX2jaTHTanV-P': 'INFS3202',
          '-Jli22md1TMXq7YhqMHd': 'DECO3800',
        }
      }
    });
  };

  afterEach(function() {
    if (!server) return;
    server.close();
    server = null;
  });

  describe('Empty Firebase', function() {
    beforeEach(function() {
      server = launchEmptyServer();
    });

    it('is empty to begin', function(done) {
      var client = new Firebase('ws://test.firebaseio.com:5000');
      client.on('value', function(snapshot) {
        var data = snapshot.val();
        expect(data).toEqual({});
        done();
      });
    });
  });

  describe('Prepopulated Firebase', function() {
    it('finds all the subjects', function(done) {
      var client = new Firebase('ws://test.firebaseio.com:5000/courseLists');

      client.on('value', function(snapshot) {
        var data = snapshot.val();
        console.log(data);

        // Assert expectations
        expect(data).toEqual({
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



