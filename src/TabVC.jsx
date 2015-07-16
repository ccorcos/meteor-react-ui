// var debug = function() {
//    console.log.apply(console, ['TabVC:'].concat(Array.prototype.slice.call(arguments)))
// }

var debug = (function() {})

this.TabVC = React.createClass({
  displayName: 'TabVC',
  mixins: [React.addons.PureRenderMixin, InstanceMixin],
  propTypes: {
    instance: React.PropTypes.object.isRequired,
    currentTab: React.PropTypes.string.isRequired,
    renderTab: React.PropTypes.func.isRequired,
  },
  getInitialState: function() {
    // restore the previous tab instances if they exist
    if (this.props.instance.state) {
      return this.props.instance.state
    } else {
      return {
        tabInstances: {[this.props.currentTab]: {}}
      }
    }
  },
  componentWillReceiveProps: function(nextProps) {
    nextTab = nextProps.currentTab
    var update = {}
    // create an instance for the new tab if it doesnt exist
    if (!this.state.tabInstances[nextTab]) {
      var tabInstances = clone(this.state.tabInstances)
      tabInstances[nextTab] = {}
      update.tabInstances = tabInstances
    }
    // if the hidden tab instance needs to be deleted
    if (nextTab != "hidden" && this.state.tabInstances.hidden) {
      var tabInstances = null
      if (update.tabInstances) {
        tabInstances = update.tabInstances
      } else {
        tabInstances = clone(this.state.tabInstances)
      }
      delete tabInstances['hidden']
      update.tabInstances = tabInstances
    }
    if (update.tabInstances) {
      this.setState(update)
    }
  },
  save: function() {
    this.props.instance.state = this.state
  },
  render: function() {
    debug(this.props.currentTab)
    return this.props.renderTab(
      this.props.currentTab,
      this.state.tabInstances[this.props.currentTab]
    )
  }
});
