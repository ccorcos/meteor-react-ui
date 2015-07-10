NavBarSmall = React.createClass({
  displayName: 'NavBarSmall',
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    title: React.PropTypes.string,
    onLeft: React.PropTypes.func,
    onRight: React.PropTypes.func
  },
  render: function() {
    var left = false
    if (this.props.onLeft) {
      left = <div className="left" onClick={this.props.onLeft}>BACK</div>
    }
    var right = false
    if (this.props.onRight) {
      right = <div className="right" onClick={this.props.onRight}>TOOLS</div>
    }
    return (
      <div className="navbar small flex-row">
        {left}
        <div className="title">{this.props.title}</div>
        {right}
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
    onTab: React.PropTypes.func.isRequired
  },
  render: function() {
    var left = false
    if (this.props.onLeft) {
      left = <div className="left" onClick={this.props.onLeft}>BACK</div>
    }
    var right = false
    if (this.props.onRight) {
      right = <div className="right" onClick={this.props.onRight}>TOOLS</div>
    }
    return (
      <div className="navbar large ">
        <div className="navbar-inner flex-row">
          <div className="title">{this.props.title}</div>
          <TabBar currentTab={this.props.currentTab} onTab={this.props.onTab}/>
        </div>
      </div>
    );
  }
});

TabBar = React.createClass({
  displayName: 'TabBar',
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    currentTab: React.PropTypes.string,
    onTab: React.PropTypes.func.isRequired
  },
  render: function() {
    var tabs = ['feed', 'profile'].map((name) => {
      var selected = (this.props.currentTab == name ? 'selected' : '')
      return (
        <div className={"tab ${name} #{selected}"}
             onClick={()=>{this.props.onTab(name)}}>
          {name.toUpperCase()}
        </div>
      )
    })
    return (
      <div className="tabbar flex-row ">
        {tabs}
      </div>
    );
  }
});

LeftGutterLarge = React.createClass({
  displayName: 'LeftGutterLarge',
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    onLeft: React.PropTypes.func
  },
  render: function() {
    var left = false
    if (this.props.onLeft) {
      left = <div className="left" onClick={this.props.onLeft}>BACK</div>
    }
    return (
      <div className="gutter large">
        {left}
      </div>
    );
  }
});

RightGutterLarge = React.createClass({
  displayName: 'RightGutterLarge',
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    onRight: React.PropTypes.func
  },
  render: function() {
    var right = false
    if (this.props.onRight) {
      right = <div className="right" onClick={this.props.onRight}>TOOLS</div>
    }
    return (
      <div className="gutter large">
        {right}
      </div>
    );
  }
});

Layout = React.createClass({
  displayName: 'Layout',
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    title: React.PropTypes.string.isRequired,
    onBack: React.PropTypes.func,
    onToggleToolbar: React.PropTypes.func,
    currentTab: React.PropTypes.string,
    onTab: React.PropTypes.func.isRequired
  },
  render: function() {
    return (
      <div className="layout flex-column">
        <NavBarSmall title={this.props.title} onLeft={this.props.onBack} onRight={this.props.onToggleToolbar}/>
        <NavBarLarge currentTab={this.props.currentTab} onTab={this.props.onTab}/>
        <div className="inner-layout flex-row">
          <LeftGutterLarge onLeft={this.props.onBack}/>
          <div className="inner-inner-layout flex-column">
            {this.props.children}
          </div>
          <RightGutterLarge onRight={this.props.onToggleToolbar}/>
          <TabBar currentTab={this.props.currentTab} onTab={this.props.onTab}/>
        </div>
      </div>
    );
  }
});
