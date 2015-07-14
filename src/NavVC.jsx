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
  ],
  propTypes: {
    initialScene: React.PropTypes.object.isRequired,
    renderScene: React.PropTypes.func.isRequired,
    onPush: React.PropTypes.func,
    onPop: React.PropTypes.func,
    onPopFront: React.PropTypes.func,
    setCanPop: React.PropTypes.func,
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
  getInitialInstance: function(props) {
    debug("getInitialInstance", props.initialScene)
    var stack = [props.renderScene(clone(props.initialScene))]
    this.setCanPop(stack)
    return {
      stack: stack,
      animation: this.getTransitionName('appear')
    }
  },
  setCanPop: function(stack) {
    debug("setCanPop", stack.length > 1)
    this.props.setCanPop && this.props.setCanPop(stack.length > 1)
  },
  push: function(route) {
    debug("push", route)
    var nextStack = React.addons.update(this.state.stack,
      {$push:[this.props.renderScene(clone(route))]})
    this.setState({
      stack: nextStack,
      animation: this.getTransitionName('push')
    })
    this.setCanPop(nextStack)
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
      this.setCanPop(nextStack)
    }
  },
  popFront: function() {
    debug("popFront")
    this.setState({stack: [stack[0]]});
  },
  instanceWillMount: function() {
    // these props could change between instances
    this.props.onPush && this.stitch(this.props.onPush(this.push))
    this.props.onPop && this.stitch(this.props.onPop(this.pop))
    this.props.onPopFront && this.stitch(this.props.onPopFront(this.popFront))
  },
  saveInstance: function(save) {
    var state = this.state
    save(function(ctx) {
      ctx.setState(state)
      ctx.setCanPop(state.stack)
    })
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
