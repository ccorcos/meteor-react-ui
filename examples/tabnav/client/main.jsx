// can set the tab from parent or child because
App = React.createClass({
  displayName: 'App',
  mixins: [React.addons.PureRenderMixin, InstanceMixin],
  propTypes: {
    initialRoute: React.PropTypes.object.isRequired,
    instance: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    if (this.props.instance.state) {
      return R.merge(this.props.instance.state, {
        leftNavButton: null,
        rightNavButton: null
      })
    } else {
      return {
        title: '',
        currentTab: this.props.initialRoute.tab,
        leftNavButton: null,
        rightNavButton: null,
      }
    }
  },
  componentWillMount: function() {
    this.tabVCInstance = this.props.instance.tabVCInstance || {}
    this.tabButtons = [{
      name: 'foxes',
      component: <div onClick={debounce(()=>{this.setState({currentTab:'foxes'})})}>FOX</div>
    },{
      name: 'whales',
      component: <div onClick={debounce(()=>{this.setState({currentTab:'whales'})})}>WHALE</div>
    }]
  },
  save: function() {
    this.props.instance.state = R.pick(['title', 'currentTab'], this.state)
    this.props.instance.tabVCInstance = this.tabVCInstance
  },
  setBackButton: function(pop) {
    if (pop) {
      this.setState({leftNavButton: <div className="back-button" onClick={debounce(pop)}>{"<"}</div>})
    } else {
      this.setState({leftNavButton: null})
    }
  },
  renderScene: function(push, {path, name, params}, sceneInstance) {
    // within a nav controller
    var props = {
      setTitle: (title) => this.setState({title}),
      push: push,
      path: path,
      key: path,
      instance: sceneInstance
    }

    if (name == '/') {
      return <Feed kind="foxes" {...props}/>
    } else if (name == '/whales') {
      return <Feed kind="whales" {...props}/>
    } else if (name == "/foxes/:id") {
      return <Item kind="foxes" id={Number(params.id)} {...props}/>;
    } else if (name == "/whales/:id") {
      return <Item kind="whales" id={Number(params.id)} {...props}/>;
    } else {
      return <NotFound key={path} path={path}/>;
    }
  },
  renderTab: function(tab, tabInstance) {

    // we use a dispatcher to dispatch push events to the NavVC from other
    // components because we never know where these events may come from
    var push = createDispatcher()

    var props = {
      registerPush: push.register,
      setPop: this.setBackButton,
      renderScene: (route, instance) => { return this.renderScene(push.dispatch, route, instance)},
      instance: tabInstance
    }

    if (tab == "foxes") {
      return (
        <NavVC
          key="nav-foxes"
          rootScene={{path:'/', name:'/'}}
          {...props}/>
      )
    } else if (tab == "whales") {
      return (
        <NavVC
          key="nav-whales"
          rootScene={{path:'/whales', name:'/whales'}}
          {...props}/>
      )
    } else if (tab == "hidden") {
      return (
        <NavVC
          key="nav-hidden"
          rootScene={this.props.initialRoute}
          {...props}/>
      )
    } else {
      console.warn('unknown tab!', tab)
      return false
    }
  },
  render: function() {
    return (
      <Layout
        title={this.state.title}
        currentTab={this.state.currentTab}
        leftNavButton={this.state.leftNavButton}
        rightNavButton={this.state.rightNavButton}
        tabButtons={this.tabButtons}>
        <TabVC
          key="tab-vc"
          currentTab={this.state.currentTab}
          renderTab={this.renderTab}
          instance={this.tabVCInstance}/>
      </Layout>
    )
  }
})


// A route looks something like this:
//
// route = {
//   name: '/user/:id',
//   path: '/user/234r234fced'
//   params: {},
//   queryParams: {}
//   hash: ''
// }

// We have one entry point to this program starting with
// the url. After that, the views are managed within the
// view controllers and urls just follow along.
var start = R.once(R.call);

// define a route for each possible entry point of the
// and specify which tab to start on.
function defineRoute(name, initialTab) {
  Router.route(name, function(route) {
    start(function() {
      route.tab = initialTab;
      React.render(<App initialRoute={route} instance={ReactInstance}/>, document.body);
    });
  });
}

// This app has a feed and a profile tab. Both are just
// lists of posts. We have a null tab which will not be
// cached so we can land directly on a post or a user.
defineRoute('/', 'foxes');
defineRoute('/whales', 'whales');
defineRoute('/foxes/:id', "hidden");
defineRoute('/whales/:id', "hidden");
defineRoute('*', "hidden"); // Capture the 404 last
