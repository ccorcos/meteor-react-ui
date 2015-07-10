// We want to cache the different tab view components so thay they can
// maintain state when switching between tabs. Thus, routing must be
// handled internally with an initial route coming in as props.

TabVC = React.createClass({
  displayroute: 'TabVC',
  propTypes: {
    initialRoute: React.PropTypes.object.isRequired,
    renderScene: React.PropTypes.func.isRequired
  },
  getInitialState() {
    // cache the tabs in the state if the route tab isn't null
    // if the route tab is null, then we want to render a scene,
    // but we don't want to cache it. This is useful when we load
    // a route that doesn't necessarily belong to a tab.
    var tabs = {}
    if (this.props.initialRoute.tab != null) {
      tabs[this.props.initialRoute.tab] = this.renderScene(this.props.initialRoute)
    }
    return {
      tabs: tabs,
      currentRoute: this.props.initialRoute
    }
  },
  renderScene(route) {
    this.props.renderScene(this, route)
  },
  setTab(route) {
    if (this.state.tabs[route.tab] || route.tab == null) {
      return this.setState({currentRoute: route})
    } else {
      var tabs = {}
      tabs[route.tab] = this.renderScene(route)
      tabs = React.addons.update(this.state.tabs, {$merge: tabs})
      this.setState({
        tabs: tabs,
        currentRoute: route
      })
    }
  },
  render() {
    if (this.state.currentRoute.tab == null) {
      return this.renderScene(this.state.currentRoute)
    } else {
      return this.state.tabs[this.state.currentRoute.tab]
    }
  }
})
