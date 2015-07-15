
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
    ListenerMixin
  ],
  propTypes: {
    currentTabStitch: React.PropTypes.obj.isRequired,
    renderTab: React.PropTypes.func.isRequired,
  },
  getInitialInstanceState: function(props) {
    var route = props.currentTabStitch.value
    var state = {currentTab: route}
    if (route.tab) {
      state[route.tab] = props.renderTab(clone(route))
    }
    return state
  },
  startListeners: function(props) {
    this.addListener(props.currentTabStitch.on((route) => {
      if (this.state.currentTab.tab != route.tab) {
        var update = {currentTab: route}
        if (route.tab && !this.state.tabs[route.tab]) {
          update.tabs = React.addons.update(this.state.tabs,
              {$merge: {[route.tab]: this.props.renderTab(clone(route))}})
        }
        this.setState(update)
      }
    }))
  }
  componentWillMount: function() {
    this.startListeners(this.props)
  },
  instanceWillUpdate: function(props, state) {
    this.stopListeners()
    this.startListeners(props)
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
