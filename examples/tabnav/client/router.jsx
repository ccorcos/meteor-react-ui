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
defineRoute('/', 'foxes');
defineRoute('/whales', 'whales');
defineRoute('/foxes/:id', null);
defineRoute('/whales/:id', null);
defineRoute('*', null); // Capture the 404 last
