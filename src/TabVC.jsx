
var debug = function() {
  console.log.apply(console, [
    "TabVC :",
  ].concat(Array.prototype.slice.call(arguments)))
}
//var debug = (()=>{})

function firstRest(f1, f2) {
  var first = true;
  return function() {
    if (first) {
      first = false
      f1.apply(this, arguments)
    } else {
      f2.apply(this, arguments)
    }
  }
}

var TabVC = React.createClass({
  displayName: 'TabVC',
  mixins: [
    React.addons.PureRenderMixin,
    InstanceMixin,
  ],
  propTypes: {
    laceCurrentTab: React.PropTypes.func.isRequired,
    renderTab: React.PropTypes.func.isRequired,
  },
  getInitialInstance: function(props) {
    return {tabs:{}}
  },
  saveInstance: function(save) {
    var state = this.state
    save(function(ctx) {
      ctx.setState(state)
      ctx.stitchCurrentTab(state)
    })
  },
  stitchCurrentTab: function(initialState) {
    this.stitch(this.props.laceCurrentTab(firstRest((route) => {
      // first
      if (!initialState.currentTab || (initialState.currentTab.tab != route.tab)) {
        debug("update initial currentTab", route)
        this.setState({currentTab: route})
        if (route.tab && !initialState.tabs[route.tab]) {
          this.setState({
            tabs: React.addons.update(initialState.tabs,
              {$merge: {[route.tab]: this.props.renderTab(clone(route))}})
          })
        }
      }
    }, (route) => {
      // rest
      if (!this.state.currentTab || (this.state.currentTab.tab != route.tab)) {
        debug("update currentTab", route)
        this.setState({currentTab: route})
        if (route.tab && !this.state.tabs[route.tab]) {
          this.setState({
            tabs: React.addons.update(this.state.tabs,
              {$merge: {[route.tab]: this.props.renderTab(clone(route))}})
          })
        }
      }
    })))
  },
  instanceWillMount: function() {
    if (!this.props.instance.canRestore) {
      this.stitchCurrentTab(this.state)
    }
  },
  render: function() {
    debug("render", this.state.currentTab)
    if (this.state.currentTab.tab == null) {
      return this.props.renderTab(clone(this.state.currentTab))
    } else {
      return this.state.tabs[this.state.currentTab.tab]
    }
  }
});

this.TabVC = TabVC;
