
var TabVC = React.createClass({
  displayName: 'TabVC',
  mixins: [
    React.addons.PureRenderMixin,
    InstanceMixin
  ],
  propTypes: {
    laceCurrentRoute: React.PropTypes.func.isRequired,
    renderRoute: React.PropTypes.func.isRequired,
  },
  getInitialInstance: function() {
    return {tabs:{}}
  },
  componentWillMount: function() {
    this.props.laceCurrentRoute((route) => {
      this.setState({currentRoute:route})
      if (route.tab && !this.state.tabs[route.tab]) {
        this.setState({
          tabs: React.addons.update(this.state.tabs,
            {$merge: {[route.tab]: this.props.renderRoute(route)}})
        })
      }
    })
  },
  render: function() {
    if (this.state.currentRoute.tab == null) {
      return this.props.renderRoute(this.state.currentRoute)
    } else {
      return this.state.tabs[this.state.currentRoute.tab]
    }
  }
});

this.TabVC = TabVC;
