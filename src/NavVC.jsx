var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var debug = function() {
  console.log.apply(console, [
    "NavVC :",
  ].concat(Array.prototype.slice.call(arguments)))
}

var debug = (()=>{})

var NavVC = React.createClass({
  displayName: 'NavVC',
  mixins: [
    React.addons.PureRenderMixin,
    InstanceMixin,
    ListenerMixin
  ],
  propTypes: {
    initialScene: React.PropTypes.object.isRequired,
    renderScene: React.PropTypes.func.isRequired,
    onPush: React.PropTypes.func,
    onPop: React.PropTypes.func,
    onPopFront: React.PropTypes.func,
    setBack: React.PropTypes.func,
    className: React.PropTypes.string
  },
  getTransitionName: function(name) {
    return `navvc-${name}`
  },
  getInitialInstanceState: function(props) {
    debug("getInitialInstance", props.initialScene)
    return {
      stack: [props.renderScene(clone(props.initialScene))],
    }
  },
  push: function(route) {
    debug("push", route)
    var nextStack = React.addons.update(this.state.stack,
      {$push:[this.props.renderScene(clone(route))]})
    this.setState({
      stack: nextStack,
      animation: this.getTransitionName('push')
    })
    this.props.setBack(nextStack.length > 1 ? this.pop : null)
  },
  pop: function() {
    debug("pop")
    if (this.state.stack.length == 1) {
      console.warn("You shouldn't pop off the root view of a NavVC!")
    } else {
      var last = this.state.stack.length - 1;
      var nextStack = React.addons.update(this.state.stack,
        {$splice:[[last, 1]]})
      this.setState({
        stack: nextStack,
        animation:  this.getTransitionName('pop')
      })
      this.props.setBack(nextStack.length > 1 ? this.pop : null)
    }
  },
  popFront: function() {
    debug("popFront")
    this.setState({stack: [stack[0]]});
  },
  componentWillMount: function() {
    debug("mount")
    // start listeners
    this.props.onPush && this.addListener(this.props.onPush(this.push))
    this.props.onPop && this.addListener(this.props.onPop(this.pop))
    this.props.onPopFront && this.addListener(this.props.onPopFront(this.popFront))
    this.setState({animation: this.getTransitionName('appear')})
    this.props.setBack(this.state.stack.length > 1 ? this.pop : null)
  },
  render: function() {
    debug("render", this.state.animation)
    var last = this.state.stack.length - 1;
    return (
      <ReactCSSTransitionGroup
        transitionAppear={true}
        className={`navvc-transition-group ${this.props.className}`}
        transitionName={this.state.animation}>
        {this.state.stack[last]}
      </ReactCSSTransitionGroup>
    );
  }
});

this.NavVC = NavVC;
