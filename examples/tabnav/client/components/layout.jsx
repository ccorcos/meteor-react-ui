// This is a responsive layout as demonstated here:
// http://codepen.io/ccorcos/pen/jPzNpP

// Left and Right components.
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
        <div className="title">{this.props.title || ''}</div>
        <div className="right">{this.props.right || false}</div>
      </div>
    );
  }
});

// tabs is an array of [{name, component}]
TabBar = React.createClass({
  displayName: 'TabBar',
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    currentTab: React.PropTypes.string,
    tabs: React.PropTypes.array.isRequired,
    className: React.PropTypes.string
  },
  render: function() {
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
          <TabBar className="large" currentTab={this.props.currentTab} tabs={this.props.tabs}/>
        </div>
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
  mixins: [
    React.addons.PureRenderMixin,
    ListenerMixin
  ],
  propTypes: {
    titleStitch: React.PropTypes.object.isRequired,
    currentTabStitch: React.PropTypes.object.isRequired,
    tabs: React.PropTypes.array.isRequired,
    leftComponentStitch: React.PropTypes.object,
    rightComponentStitch: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      title: this.props.titleStitch.value,
      currentTab: this.props.currentTabStitch.value.tab,
      leftComponent: this.props.leftComponentStitch.value,
      rightComponent: this.props.rightComponentStitch.value
    }
  },
  set: function(name) {
    return (value) => {
      this.setState({[name]:value})
    }
  },
  componentWillMount: function() {
    this.addListener(this.props.leftComponentStitch.on(this.set('leftComponent')))
    this.addListener(this.props.rightComponentStitch.on(this.set('rightComponent')))
    this.addListener(this.props.titleStitch.on(this.set('title')))
    this.addListener(this.props.currentTabStitch.on(({tab}) => {
      this.setState({currentTab:tab})
    }))
  },

  render: function() {
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
