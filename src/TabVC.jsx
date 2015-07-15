this.TabVC = React.createClass({
  displayName: 'TabVC',
  mixins: [React.addons.PureRenderMixin, UIMixin],
  propTypes: {
    instance: React.PropTypes.object.isRequired,
    tabRouteStitch: React.PropTypes.object.isRequired,
    renderTab: React.PropTypes.func.isRequired,
  },
  getInitialState: function() {
    if (this.props.instance.state) {
      this.props.tabRouteStitch.set(this.props.instance.state.currentTabRoute)
      return this.props.instance.state
    } else {
      return {
        currentTabRoute: this.props.tabRouteStitch.value,
        tabInstances: {[this.props.tabRouteStitch.value.tab]: {}}
      }
    }
  },
  componentWillMount: function() {
    this.listeners.push(this.props.tabRouteStitch.listen((tabRoute) => {
      // if tab changed
      if (this.state.currentTabRoute.tab != tabRoute.tab) {
        var update = {currentTabRoute: tabRoute}
        // if an instance hasnt been create for this tab
        if (!this.state.tabInstances[tabRoute.tab]) {
          var tabInstances = clone(this.state.tabInstances)
          tabInstances[tabRoute.tab] = {}
          update.tabInstances = tabInstances
        }
        // if the hidden tab instance needs to be deleted
        if (tabRoute.tab != "hidden" && this.state.tabInstances.hidden) {
          var tabInstances = null
          if (update.tabInstances) {
            tabInstances = update.tabInstances
          } else {
            tabInstances = clone(this.state.tabInstances)
          }
          delete tabInstances['hidden']
          update.tabInstances
        }
        this.setState(update)
      }
    }))
  },
  save: function() {
    this.props.instance.state = this.state
  },
  render: function() {
    return this.props.renderTab(
      this.state.currentTabRoute,
      this.state.tabInstances[this.state.currentTabRoute.tab]
    )
  }
});
