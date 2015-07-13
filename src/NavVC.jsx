var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var NavVC = React.createClass({
  displayName: 'NavVC',
  mixins: [
    React.addons.PureRenderMixin,
    InstanceMixin
  ],
  propTypes: {
    initialScene: React.PropTypes.object.isRequired,
    renderScene: React.PropTypes.func.isRequired
    onPush: React.PropTypes.func,
    onPop: React.PropTypes.func,
    onPopFront: React.PropTypes.func,
    setCanPop: React.PropTypes.func,
    transitionNames: React.PropTypes.func,
    className: React.PropTypes.string
  },
  getTransitionName: function(name) {
    (this.props.transitionNames && this.props.transitionNames[name]) || `navvc-${name}`
  }
  getInitialInstance: function() {
    return {
      stack: [this.props.renderScene(this.props.initialScene)],
      animation: this.getTransitionName('appear')
    }
  },
  setCanPop: function() {
    this.props.setCanPop && this.props.setCanPop(this.state.stack.length > 1)
  },
  push: function(route) {
    this.setState({
      stack: React.addons.update(this.state.stack,
        {$push:[this.props.renderScene(route)]}),
      animation: this.getTransitionName('push')
    }, this.setCanPop);
  },
  pop: function() {
    if (this.state.stack.length == 1) {
      console.warn("You shouldn't pop off the root view of a NavVC!")
    } else {
      var last = this.state.stack.length - 1;
      this.setState({
        stack: React.addons.update(this.state.stack,
          {$splice:[[last, 1]]}),
        animation:  this.getTransitionName('pop')
      }, this.setCanPop);
    }
  },
  popFront: function() {
    this.setState({stack: [stack[0]]});
  }.
  componentWillMount: function() {
    this.props.onPush && this.props.onPush(this.push)
    this.props.onPop && this.props.onPop(this.pop)
    this.props.onPopFront && this.props.onPopFront(this.popFront)
    this.setCanPop()
  },
  render: function() {
    var last = this.state.stack.length - 1;
    return (
      <ReactCSSTransitionGroup className={this.props.className} transitionName={this.state.animation}>
        {this.state.stack[last]}
      </ReactCSSTransitionGroup>
    );
  }
});

this.NavVC = NavVC;
