// This is a responsive layout as demonstated here:
// http://codepen.io/ccorcos/pen/jPzNpP

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

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
        <div className="left">
          <ReactCSSTransitionGroup className="full-size" transitionName="scale">
            {this.props.left || false}
          </ReactCSSTransitionGroup>
        </div>
        <div className="title">
          <ReactCSSTransitionGroup className="full-size" transitionName="fade">
            <div key={this.props.title}>{this.props.title || ''}</div>
          </ReactCSSTransitionGroup>
        </div>
        <div className="right">
          <ReactCSSTransitionGroup className="full-size" transitionName="scale">
            {this.props.right || false}
          </ReactCSSTransitionGroup>
        </div>
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
    tabButtons: React.PropTypes.array.isRequired,
    className: React.PropTypes.string
  },
  render: function() {
    var tabs = this.props.tabButtons.map(({name, component}) => {
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
    tabButtons: React.PropTypes.array.isRequired
  },
  render: function() {
    return (
      <div className="navbar large">
        <div className="inner-navbar">
          <div className="title">{this.props.title}</div>
          <TabBar className="large" currentTab={this.props.currentTab} tabButtons={this.props.tabButtons}/>
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
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    title: React.PropTypes.string.isRequired,
    currentTab: React.PropTypes.string.isRequired,
    leftNavButton: React.PropTypes.object,
    rightNavButton: React.PropTypes.object,
    tabButtons: React.PropTypes.array.isRequired,
  },
  render: function() {
    return (
      <div className="layout">
        <NavBarSmall title={this.props.title} left={this.props.leftNavButton} right={this.props.rightNavButton}/>
        <NavBarLarge title={this.props.title} currentTab={this.props.currentTab} tabButtons={this.props.tabButtons}/>
        <div className="inner-layout">
          <LeftGutterLarge left={this.props.leftNavButton}/>
          <div className="content">
            {this.props.children}
          </div>
          <RightGutterLarge right={this.props.rightNavButton}/>
        </div>
        <TabBar className="small" currentTab={this.props.currentTab} tabButtons={this.props.tabButtons}/>
      </div>
    );
  }
});
