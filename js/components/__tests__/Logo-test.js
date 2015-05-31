jest.dontMock('../Logo.jsx');

var React = require('react/addons'); // React with TestUtils
var TestUtils = React.addons.TestUtils;
var Simulate = TestUtils.Simulate; // For event simulation

describe('Logo component', () => {
  // Not sure whether to require the component in the Suite's scope, or not.
  var Logo = require('../Logo.jsx');

  // Shallow renderer allows us to render 1 layer deep. This is a new
  // testing feature added in the 0.13 release
  var shallowRenderer;

  beforeEach(() => {
    shallowRenderer = TestUtils.createRenderer();
  })

  it('should contain an image', () => {
    shallowRenderer.render(<Logo />);
    var result = shallowRenderer.getRenderOutput();

    expect(result).not.toBeNull();
    expect(result.props.children.type).toEqual('img');
  });

});
