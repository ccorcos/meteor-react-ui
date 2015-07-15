var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

NavVC = React.createClass({
  displayName: 'NavVC',
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    instance: React.PropTypes.object.isRequired,
    initialSceneRoute: React.PropTypes.object.isRequired,
    renderScene: React.PropTypes.func.isRequired,
    listenPush: React.PropTypes.func.isRequired,
    setPop: React.PropTypes.func.isRequired,
    listenPopFont: React.PropTypes.func,
    className: React.PropTypes.string
  },
  getInitialState: function() {
    if (this.props.instance.state) {
      return this.props.instance.state
    } else {
      return {
        animation: 'navvc-appear',
        stack: [{
          sceneRoute: initialSceneRoute,
          instance: {}
        }]
      }
    }
  },
  push: function(route) {
    var nextStack = React.addons.update(this.state.stack,
      {$push:[{
        sceneRoute: route,
        instance: {}
      }]})
    this.setState({
      stack: nextStack,
      animation: 'navvc-push'
    })
    this.props.setPop(nextStack.length > 1 ? this.pop : null)
  },
  pop: function() {
    if (this.state.stack.length == 1) {
      console.warn("You shouldn't pop off the root view of a NavVC!")
    } else {
      var last = this.state.stack.length - 1;
      var nextStack = React.addons.update(this.state.stack,
        {$splice:[[last, 1]]})
      this.setState({
        stack: nextStack,
        animation: 'navvc-pop'
      })
      this.props.setPop(nextStack.length > 1 ? this.pop : null)
    }
  },
  popFront: function() {
    this.setState({stack: [stack[0]]});
    this.props.setPop(null)
  },
  componentWillMount: function() {
    // start listeners
    this.listeners = []
    this.props.listenPush && this.listeners.push(this.props.listenPush(this.push))
    this.props.listenPopFont && this.listeners.push(this.props.listenPopFont(this.popFront))
    this.setState({animation: 'navvc-appear'})
    this.props.setPop(this.state.stack.length > 1 ? this.pop : null)
  },
  componentWillUnmount: function() {
    this.listeners.map((f) => f())
    this.props.instance.state = this.state
  },
  render: function() {
    var last = this.state.stack.length - 1;
    var {sceneRoute, instance} = this.state.stack[last]
    return (
      <ReactCSSTransitionGroup
        transitionAppear={true}
        className={`navvc-transition-group ${this.props.className}`}
        transitionName={this.state.animation}>
        {this.props.renderScene(sceneRoute, instance)}
      </ReactCSSTransitionGroup>
    );
  }
});
