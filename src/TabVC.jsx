
var TabVC = React.createClass({
  displayName: 'TabVC',
  mixins: [
    React.addons.PureRenderMixin,
    InstanceMixin
  ],
  propTypes: {
    laceCurrentTab: React.PropTypes.func.isRequired,
    renderTab: React.PropTypes.func.isRequired,
  },
  getInitialInstance: function() {
    return {tabs:{}}
  },
  componentWillMount: function() {
    this.props.laceCurrentTab((route) => {
      this.setState({currentTab:route})
      if (route.tab && !this.state.tabs[route.tab]) {
        this.setState({
          tabs: React.addons.update(this.state.tabs,
            {$merge: {[route.tab]: this.props.renderTab(route)}})
        })
      }
    })
  },
  render: function() {
    if (this.state.currentTab.tab == null) {
      return this.props.renderTab(this.state.currentTab)
    } else {
      return this.state.tabs[this.state.currentTab.tab]
    }
  }
});

this.TabVC = TabVC;
