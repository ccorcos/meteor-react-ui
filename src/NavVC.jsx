var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var debug = function() {
  console.log.apply(console, [
    "NavVC :",
  ].concat(Array.prototype.slice.call(arguments)))
}
//var debug = (()=>{})

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
    onPush: React.PropTypes.func.isRequired,
    onPop: React.PropTypes.func.isRequired,
    onPopFront: React.PropTypes.func,
    setCanPop: React.PropTypes.func.isRequired,
    transitionNames: React.PropTypes.object,
    className: React.PropTypes.string
  },
  getTransitionName: function(name) {
    if (this.props.transitionNames) {
      return this.props.transitionNames[name]
    } else {
      return `navvc-${name}`
    }
  },
  getInitialInstanceState: function(props) {
    debug("getInitialInstance", props.initialScene)
    return {
      stack: [props.renderScene(clone(props.initialScene))],
      animation: this.getTransitionName('appear')
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
    this.props.setCanPop(stack.length > 1)
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
      this.props.setCanPop(stack.length > 1)
    }
  },
  popFront: function() {
    debug("popFront")
    this.setState({stack: [stack[0]]});
  },
  startListeners: function(props) {
    this.addListener(props.onPush(this.push))
    this.addListener(props.onPop(this.pop))
    props.onPopFront && this.addListener(props.onPopFront(this.popFront))
  }
  componentWillMount: function() {
    this.startListeners(this.props)
  },
  instanceWillUpdate: function(props, state) {
    this.stopListeners()
    this.startListeners(props)
    this.props.setCanPop(state.stack.length > 1)
  },
  render: function() {
    debug("render")
    var last = this.state.stack.length - 1;
    return (
      <ReactCSSTransitionGroup className={'navvc-transition-group ' + this.props.className} transitionName={this.state.animation}>
        {this.state.stack[last]}
      </ReactCSSTransitionGroup>
    );
  }
});

this.NavVC = NavVC;
