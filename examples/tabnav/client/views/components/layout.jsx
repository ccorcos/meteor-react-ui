// This is a responsive layout as demonstated here:
// http://codepen.io/ccorcos/pen/jPzNpP

NavBarSmall = React.createClass({
  displayName: 'NavBarSmall',
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    title: React.PropTypes.string,
    left: React.PropTypes.object,
    right: React.PropTypes.object
  },
  render: function() {
    return (
      <div className="navbar small">
        <div className="left">{this.props.left || false}</div>
        <div className="title">{this.props.title}</div>
        <div className="right">{this.props.right || false}</div>
      </div>
    );
  }
});

NavBarLarge = React.createClass({
  displayName: 'NavBarLarge',
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    title: React.PropTypes.string,
    currentTab: React.PropTypes.string,
    tabs: React.PropTypes.array.isRequired
  },
  render: function() {
    return (
      <div className="navbar large">
        <div className="inner-navbar">
          <div className="title">{this.props.title}</div>
          <TabBar currentTab={this.props.currentTab} tabs={this.props.tabs}/>
        </div>
      </div>
    );
  }
});

TabBar = React.createClass({
  displayName: 'TabBar',
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    className: React.PropTypes.string,
    tabs: React.PropTypes.array.isRequired,
    currentTab: React.PropTypes.string,
  },
  render: function() {
    // tab = {name, component}
    var tabs = this.props.tabs.map(({name, component}) => {
      var selected = (this.props.currentTab == name ? 'selected' : '')
      return (
        <div className={`tab ${name} ${selected}`} key={`tab-key-${name}`}>
          {component}
        </div>
      )
    })
    return (
      <div className={`tabbar ${this.props.className}`}>
        {tabs}
      </div>
    );
  }
});

LeftGutterLarge = React.createClass({
  displayName: 'LeftGutterLarge',
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    left: React.PropTypes.object
  },
  render: function() {
    return (
      <div className="gutter large">
        <div className="left">{this.props.left || false}</div>
      </div>
    );
  }
});

RightGutterLarge = React.createClass({
  displayName: 'RightGutterLarge',
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    right: React.PropTypes.object
  },
  render: function() {
    return (
      <div className="gutter large">
        <div className="right">{this.props.right || false}</div>
      </div>
    );
  }
});

Layout = React.createClass({
  displayName: 'Layout',
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    stitchTitle: React.PropTypes.func.isRequired,
    stitchLeftComponent: React.PropTypes.func,
    stitchRightComponent: React.PropTypes.func,
    stitchCurrentTab: React.PropTypes.func.isRequired,
    tabs: React.PropTypes.array.isRequired
  },
  componentWillMount: function() {
    this.props.stitchLeftComponent((value) => {
      this.setState({leftComponent:value})
    })
    this.props.stitchRightComponent((value) => {
      this.setState({rightComponent:value})
    })
    this.props.stitchTitle((value) => {
      this.setState({title:value})
    })
    this.props.stitchCurrentTab((value) => {
      this.setState({currentTab:value})
    })
  },
  render: function() {
    console.log("render Layout")
    return (
      <div className="layout">
        <NavBarSmall title={this.state.title} left={this.state.leftComponent} right={this.state.rightComponent}/>
        <NavBarLarge title={this.state.title} currentTab={this.state.currentTab} tabs={this.props.tabs}/>
        <div className="inner-layout">
          <LeftGutterLarge left={this.state.leftComponent}/>
          <div className="content">
            {this.props.children}
          </div>
          <RightGutterLarge right={this.state.rightComponent}/>
        </div>
        <TabBar className="small" currentTab={this.state.currentTab} tabs={this.props.tabs}/>
      </div>
    );
  }
});

Feed = React.createClass({
  displayName: 'Feed',
  propTypes: {
    setTitle: React.PropTypes.func.isRequired,
    setLeft: React.PropTypes.func.isRequired,
    setRight: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {toolbarOpen: false}
  },
  toggleToolbar: function() {
    this.setState({toolbarOpen:!this.state.toolbarOpen})
  },
  componentWillMount: function() {
    this.props.setTitle('Feed')
    this.props.setLeft(null)
    this.props.setRight((
      <div className="toggle-toolbar" onClick={this.toggleToolbar}>
        TOOLS
      </div>
    ))
  },
  render: function() {
    console.log("render Feed")
    return (
      <div className="view feed">
        This is the feed page!
      </div>
    );
  }
});

Profile = React.createClass({
  displayName: 'Profile',
  propTypes: {
    setTitle: React.PropTypes.func.isRequired,
    setLeft: React.PropTypes.func.isRequired,
    setRight: React.PropTypes.func.isRequired
  },
  componentWillMount: function() {
    this.props.setTitle('Profile')
    this.props.setLeft(null)
    this.props.setRight(null)
  },
  render: function() {
    console.log("render Profile")
    return (
      <div className="view profile">
        This is the profile.
      </div>
    );
  }
});

function stitch(initialValue=null) {
  var obj = {
    getters: [],
    value: initialValue,
  }
  obj.set = function(value) {
    this.value = value
    this.getters.map((f) => {f(value)})
  }.bind(obj)
  obj.getter = function(func) {
    this.getters.push(func)
    func(this.value)
  }.bind(obj)
  return obj
}

TabVC = React.createClass({
  displayName: 'TabVC',
  propTypes: {
    stitchCurrentTab: React.PropTypes.func.isRequired,
    renderTab: React.PropTypes.func.isRequired,
  },
  getInitialState: function() {
    return {tabs:{}}
  },
  componentWillMount: function() {
    this.props.stitchCurrentTab((name) => {
      if (this.state.tabs[name]) {
        this.setState({currentTab:name})
      } else {
        var tab = this.props.renderTab(name)
        var tabs = React.addons.update(this.state.tabs, {
          $merge: {[name]:tab}
        })
        this.setState({
          currentTab: name,
          tabs: tabs
        })
      }
    })
  },
  render: function() {
    console.log("render TabVC")
    return this.state.tabs[this.state.currentTab]
  }
});

var App = React.createClass({
  displayName: 'App',
  componentWillMount: function() {
    this.titleStitch = stitch('')
    this.leftStitch = stitch()
    this.rightStitch = stitch()
    this.currentTabStitch = stitch('feed')
    tabSetter = (name) => () => {this.currentTabStitch.set(name)}
    this.tabs = [{
      name: 'feed',
      component: <div onClick={tabSetter('feed')}>FEED</div>
    },{
      name: 'profile',
      component: <div onClick={tabSetter('profile')}>PROFILE</div>
    }]
  },
  renderTab: function(name) {
    var props = {
      setTitle: this.titleStitch.set,
      setLeft: this.leftStitch.set,
      setRight: this.rightStitch.set
    }
    if (name == "feed") {
      return <Feed {...props}/>
    } else if (name == "profile") {
      return <Profile {...props}/>
    } else {
      console.warn(`Unknown tab: ${name}`)
      return false
    }
  },
  render: function() {
    console.log("render App")
    return (
      <Layout
        stitchTitle={this.titleStitch.getter}
        stitchLeftComponent={this.leftStitch.getter}
        stitchRightComponent={this.rightStitch.getter}
        stitchCurrentTab={this.currentTabStitch.getter}
        tabs={this.tabs}>
        <TabVC
          stitchCurrentTab={this.currentTabStitch.getter}
          renderTab={this.renderTab}/>
      </Layout>
    );
  }
});

Meteor.startup(function() {
  React.render(<App/>, document.body);
})
