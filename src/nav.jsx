
NavVC = React.createClass({
  displayName: 'NavVC',
  propTypes: {
    initialRoute: React.PropTypes.object.isRequired,
    renderScene: React.PropTypes.func.isRequired
  },
  getInitialState() {
    return {
      stack: [this.renderScene(this.props.initialRoute)]
    }
  },
  renderScene(route) {
    this.props.renderScene(this, route)
  },
  push(route) {
    component = this.renderScene(route)
    stack = React.addons.update(this.state.stack, {$push:component})
    this.setState({stack: stack})
  },
  pop() {
    last = this.state.stack.length - 1
    stack = React.addons.update(this.state.stack, {$splice:[[last, 1]]})
    this.setState({stack: stack})
  },
  render() {
    last = this.state.stack.length - 1
    return this.state.stack[last]
  }
})
