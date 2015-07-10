// This app has 2 tabs, feed and profile. Feed is a list of posts
// and profile is a specific user's list of posts. Each tab has its
// own nav controller to keep its own history.
var App = React.createClass({
  displayName: 'App',
  propTypes: {
    initialRoute: React.PropTypes.object.isRequired
  },
  render: function() {
    return (
      <TabVC initialRoute={this.props.initialRoute}
             renderScene={renderTab}/>
    );
  }
});

// curry renderRoute because that will be used to render to
// to render within the view controller
var _renderRoute = (tabVC) => (navVC, route) => renderRoute(tabVC, navVC, route);

function renderTab(tabVC, route) {
  if (route.tab == "feed") {
    // Feed TabNav
    return (
      <NavVC initialRoute={route}
             renderScene={_renderRoute(tabVC)}/>
    );
  } else if (route.tab == "profile") {
    // Profile TabNav
    return (
      <NavVC initialRoute={route}
             renderScene={_renderRoute(tabVC)}/>
    );
  } else {
    // Other TabNav should have route.tab == null
    // and wont be cached by the TabVC
    return (
      <NavVC initialRoute={route}
             renderScene={_renderRoute(tabVC)}/>
    );
  }
}

function renderRoute(tabVC, navVC, route) {
  var props = {tabVC, navVC, route};
  if (route.name == '/') {
    return <Feed {...props}/>;
  } else if (route.name == '/profile') {
    return <Profile {...props}/>;
  } else if (route.name == '/post/:id') {
    return <Post {...props}/>;
  } else if (route.name == '/user/:id') {
    return <User {...props}/>;
  } else if (route.name == '*') {
    return <NotFound {...props}/>;
  } else {
    throw new Meteor.Error(69, "This shouldn't ever happen.");
  }
}

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
      React.render(<App initialRoute={route}/>, document.body);
    });
  });
}

// This app has a feed and a profile tab. Both are just
// lists of posts. We have a null tab which will not be
// cached so we can land directly on a post or a user.
defineRoute('/', 'feed');
defineRoute('/profile', 'profile');
defineRoute('/post/:id', null);
defineRoute('/user/:id', null);
defineRoute('*', null); // Capture the 404 last
