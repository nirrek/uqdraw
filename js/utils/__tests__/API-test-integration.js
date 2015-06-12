jest.dontMock('../API.js');

describe('API Integration', () => {
  const integrationTestFirebaseRoot = 'https://uqdrawdeploy.firebaseio.com';
  let APIConstants = require('../API.js').APIConstants;
  let API;


  beforeEach(() => {
    API = require('../API.js').default;
  });

  let asyncFlag;
  let pollCount;

  xit('should timeout', () => {
    runs(function() {
      asyncFlag = false;
      pollCount = 0;
    });
  });

  it('it fucks with other firebase', () => {
    runs(() => {
      asyncFlag = false;
      pollCount = 0;

      // API.setFirebaseRoot(integrationTestFirebaseRoot);

      let componentKey = '1234';
      let userId = 'uqjstee8';
      let subject = 'SOMETHINGELSE';
      API.subscribe(APIConstants.subjects, componentKey, userId);
      API.addToSubjects(userId, subject, (error) => {
        console.log('this got called');
        console.log(error);
        asyncFlag = true;
      });
    });

    waitsFor(() => {
      pollCount++;
      return asyncFlag;
    });

    runs(() => {
      console.log('it completed');
      console.log('poll count', pollCount);
    });
  });
});
