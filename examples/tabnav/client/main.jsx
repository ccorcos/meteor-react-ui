

var App = React.createClass({
  displayName: 'App',
  mixins: [
    React.addons.PureRenderMixin,
  ],
  componentWillMount: function() {
    this.titleStitch = createStitch('')
    this.leftStitch = createStitch(null)
    this.rightStitch = createStitch(null)
    this.currentTabStitch = createStitch({tab:'foxes'})

    var setFeedTab = () =>
      this.currentTabStitch.set({tab:'foxes'})
    var setProfileTab = () =>
      this.currentTabStitch.set({tab:'whales'})
    this.tabs = [{
      name: 'foxes',
      component: <div onClick={setFeedTab}>FOX</div>
    },{
      name: 'whales',
      component: <div onClick={setProfileTab}>WHALE</div>
    }]
    this.tabVCInstance = createInstance()
  },

  renderTab: function(route) {
    var tab = route.tab
    console.log("render tab:", tab)

    // for each tab, we need to stitch it into the Layout
    var pushStitch = createStitch()
    var popStitch = createStitch()
    var canPopStitch = createStitch(false)

    // stitch the back button up
    canPopStitch.lace((canPop) => {
      if (canPop) {
        this.leftStitch.set(<div onClick={popStitch.call}>{"<"}</div>)
      } else {
        this.leftStitch.set(null)
      }
    })

    var renderScene = (route) => {
      console.log("render scene:", route.path)
      if (route.path == "/foxes" || route.path == "/whales") {
        var props = {
          setTitle: this.titleStitch.set,
          push: pushStitch.call,
          path: route.path,
          kind: tab,
          instance: createInstance()
        }
        return <Feed {...props}/>
      } else if (route.name == "/foxes/:id") {
        return false;
      } else if (route.name == "/whales/:id") {
        return false;
      } else {
        return false;
      }
    }

    // If we're rendering a certain tab, then lets set the
    // initial scene path.
    if (tab == 'foxes') {
      route.path = '/foxes'
    } else if (tab == 'whales') {
      route.path = '/whales'
    }

    // create an instance for the NavVC
    var props = {
      instance: createInstance(),
      initialScene: route,
      renderScene: renderScene,
      onPush: pushStitch.on,
      onPop: popStitch.on,
      setCanPop: canPopStitch.set,
    }

    if (tab == "foxes") {
      return <NavVC className={''} {...props}/>
    } else if (tab == "whales") {
      return <NavVC className={''} {...props}/>
    } else {
      // if its neither tab, then its got to be a null tab.
      return <NavVC className={''} {...props}/>
    }
  },
  render: function() {
    return (
      <Layout
        laceTitle={this.titleStitch.lace}
        laceCurrentTab={this.currentTabStitch.lace}
        tabs={this.tabs}
        laceLeftComponent={this.leftStitch.lace}
        laceRightComponent={this.rightStitch.lace}>
        <TabVC
          laceCurrentTab={this.currentTabStitch.lace}
          renderTab={this.renderTab}
          instance={this.tabVCInstance}/>
    </Layout>
    );
  }
});

Meteor.startup(function() {
  React.render(<App/>, document.body);
})
















// // This app has 2 tabs, feed and profile. Feed is a list of posts
// // and profile is a specific user's list of posts. Each tab has its
// // own nav controller to keep its own history.
// var App = React.createClass({
//   displayName: 'App',
//   propTypes: {
//     initialRoute: React.PropTypes.object.isRequired
//   },
//   render: function() {
//     return (
//
//       <TabVC initialRoute={this.props.initialRoute}
//              renderScene={renderTab}/>
//     );
//   }
// });
//
// // curry renderRoute because that will be used to render to
// // to render within the view controller
// var _renderRoute = (tabVC) => (navVC, route) => renderRoute(tabVC, navVC, route);
//
// function renderTab(tabVC, route) {
//   if (route.tab == "feed") {
//     // Feed TabNav
//     return (
//       <NavVC initialRoute={route}
//              renderScene={_renderRoute(tabVC)}/>
//     );
//   } else if (route.tab == "profile") {
//     // Profile TabNav
//     return (
//       <NavVC initialRoute={route}
//              renderScene={_renderRoute(tabVC)}/>
//     );
//   } else {
//     // Other TabNav should have route.tab == null
//     // and wont be cached by the TabVC
//     return (
//       <NavVC initialRoute={route}
//              renderScene={_renderRoute(tabVC)}/>
//     );
//   }
// }
//
// function renderRoute(tabVC, navVC, route) {
//   var props = {tabVC, navVC, route};
//   if (route.name == '/') {
//     return <Feed {...props}/>;
//   } else if (route.name == '/profile') {
//     return <Profile {...props}/>;
//   } else if (route.name == '/post/:id') {
//     return <Post {...props}/>;
//   } else if (route.name == '/user/:id') {
//     return <User {...props}/>;
//   } else if (route.name == '*') {
//     return <NotFound {...props}/>;
//   } else {
//     throw new Meteor.Error(69, "This shouldn't ever happen.");
//   }
// }
//
// // A route looks something like this:
// //
// // route = {
// //   name: '/user/:id',
// //   path: '/user/234r234fced'
// //   params: {},
// //   queryParams: {}
// //   hash: ''
// // }
//
//
// // We have one entry point to this program starting with
// // the url. After that, the views are managed within the
// // view controllers and urls just follow along.
// var start = R.once(R.call);
//
// // define a route for each possible entry point of the
// // and specify which tab to start on.
// function defineRoute(name, initialTab) {
//   Router.route(name, function(route) {
//     start(function() {
//       route.tab = initialTab;
//       React.render(<App initialRoute={route}/>, document.body);
//     });
//   });
// }
//
// // This app has a feed and a profile tab. Both are just
// // lists of posts. We have a null tab which will not be
// // cached so we can land directly on a post or a user.
// defineRoute('/', 'feed');
// defineRoute('/profile', 'profile');
// defineRoute('/post/:id', null);
// defineRoute('/user/:id', null);
// defineRoute('*', null); // Capture the 404 last
