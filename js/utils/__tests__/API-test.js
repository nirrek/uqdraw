jest.dontMock('../API.js');

describe('API', () => {
  let API;
  let APIConstants = require('../API.js').APIConstants;

  beforeEach(() => {
    API = require('../API.js').default;
  });

  describe('subscribe', () => {

    it('sets up subscriptions correctly for each APIConstant', () => {

      Object.keys(APIConstants).forEach((key) => {
        let componentKey = '1asdf6';
        let filter = 'someFilterNameAsItsRequired';
        API.subscribe(key, componentKey, filter);

        let refs = API.getRefs();

        expect(refs[key]).toBeDefined();
        expect(refs[key][filter]).toBeDefined();
        expect(refs[key][filter].ref).toBeTruthy();
        expect(refs[key][filter].listening).toEqual({[componentKey]: componentKey});
      });
    });

    it('removes subscriptions correctly for each APIConstant', () => {
      Object.keys(APIConstants).forEach((key) => {
        // Setup a subscription
        let componentKey = '1asdf6';
        let filter = 'someFilterNameAsItsRequired';
        API.subscribe(key, componentKey, filter);

        // Get ref before unsubscribe call, as it will null it out.
        let refs = API.getRefs();
        let ref = refs[key][filter].ref;
        API.unsubscribe(key, componentKey, filter);

        expect(ref.off).toBeCalled();
        expect(refs[key][filter].listening).toEqual({});
        expect(refs[key][filter].ref).toBeNull();
      });
    });
  });
  // subscribe
    // test that we can subscribe to everything we want by using API constants.
    // test that we get an error if we try to subscribe to something bogus
    // test that the correct subscription method is invokes

    // Test all the cases for initializeRefs() (need to expose refs)
    // test adding a fresh refType
    // test adding a fresh filter for existing refType

});
