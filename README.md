# React Nav and Tab Contollers

# TODO
- change the TabVC and NavVC APIs to be more similar.
- finish this readme
- more polished WORKING examples
- comment up the tabnav example

    meteor add react-runtime
    meteor add jsx
    meteor add ccorcos:react-ui

# Concepts

## Stitches

A "stitch" is a simple event system. You can create a stitch with an optional
default value:

    titleStitch = createTitle('Default Title')

You can get the value of the stitch:

    currentTitle = titleStitch.value

You can also listen for new values.

    handle = titleStitch.listen((title) => {
      console.log(title)
    })

    titleStitch.set('New Title')
    // => New Title

    // stop the listener
    handle.stop()

Stitches are useful for "stitching" together your React Components,
particularly components that don't have a direct hierarchy.

## Instances

A React component "instance" is nothing more than a *mutable* object passed
as a prop. When a component unmounts, we can save the instance of the component
by mutating the instance prop. Then when we remount the component, we can
restore the previous instance of the component.

Here's a simple example of using this technique so save a component's state.

    var Counter = React.createClass({
      displayName: 'Counter',
      mixins: [React.addons.PureRenderMixin],
      propTypes: {
        instance: React.PropTypes.object.isRequired
      },
      getInitialState: function() {
        return this.props.instance.state || {count:10}
      },
      inc: function() {
        this.setState({count: this.state.count + 1})
      },
      componentWillUnmount: function() {
        this.props.instance.state = this.state
      },
      render: function() {
        return <div>{this.state.count}</div>
      }
    })

Its also sometimes nice to save the scroll position.

    var Article = React.createClass({
      displayName: 'Article',
      mixins: [React.addons.PureRenderMixin],
      propTypes: {
        instance: React.PropTypes.object.isRequired,
        text: React.PropTypes.string.isRequired
      },
      componentDidMount: function() {
        this.getDOMNode().scrollTop = this.props.instance.scrollTop || 0
      },
      componentWillUnmount: function() {
        this.props.instance.scrollTop = this.getDOMNode().scrollTop
      },
      render: function() {
        return <div>{this.props.article}</div>
      }
    })

Now we can design our app with a top-level component and a top-level instance.
All other instances in the app can be nested inside the top-level instance.
So long as we're careful to store only primitive data in our instances, we can
serialize the whole interface instance and restore it during hot-code pushes
simply by saving the top-level instance.

This package gives you some tools to help you with this pattern. Live-reloads
do not unmount your components so we have a global stitch to trigger a save.
Using the `ReactInstanceMixin`, all you have to do is define a `save` function
which will be called on the `componentWillUnmount` and whenever
`saveReactInstance` is called such as on live-reloads. This package also
defines a top-level `ReactInstance` for you.

Here's how you might use it:

    var Counter = React.createClass({
      displayName: 'Counter',
      mixins: [React.addons.PureRenderMixin, ReactInstanceMixin],
      propTypes: {
        instance: React.PropTypes.object.isRequired
      },
      getInitialState: function() {
        return this.props.instance.state || {count:10}
      },
      inc: function() {
        this.setState({count: this.state.count + 1})
      },
      save: function() {
        this.props.instance.state = this.state
      },
      render: function() {
        return <div>{this.state.count}</div>
      }
    })

    Meteor.startup(function() {
      React.render(<Counter instance={ReactInstance}/>, document.body)
    })

And there you have it. The count will be migrated between live-reloads. You
can test it out by calling `Meteor._reload.reload()`.

**Notes:**
- all components with unique instances must also have a unique key
- don't forget to mutate your instances!

# Components

This package comes with two view controller components that are ubiquitous
in mobile apps: TabVC and NavVC. TabVC is inspired by the iOS
UITabBarController and NavVC is inspired by the iOS UINavigationController.

One thing to notice is that in the classical tab-nav app layout there is a
navigation history for each tab. Thus, the browser history is insufficient
on its own to build these complicated interfaces. Thus, I only rely on the
router as an entry point to my "program". I set the routes when the views
change, buts only so the user can share the link and enter the program at
a different point.

## TabVC

TabVC has three props:
- instance
- tabRouteStitch
- renderTab

The tabRouteStitch allows you to set the tab from another component using
`tabRouteStitch.set({tab:'name'})`. It also allows the TabVC to set the tab
if it is being restored from a previous instance.

`renderTab(route, instance)` is a function that must return a React Component
for the TabVC to render. The TabVC will create and save the instances for its
children. The instances are saved based on the `route.tab` property.

There is one special tab, called "hidden". The TabVC will create an instance
for this tab, but as soon as you navigate to another tab, this instance will
be thrown away. This is useful if the user lands on a page via direct link and
you want to display it but don't have a specific tab for it.

Here's a simple, hopefully not too contrived, example of how to use it:

    function renderTab(tabRoute, instance) {
      var {tab} = tabRoute
      if (tab == 'feed') {
        return <div>feed page</div>
      } else if (tab == 'profile'){
        return <div>profile page</div>
      }
    }

    var Tabbar = React.createClass({
      displayName: 'Tabbar',
      mixins: [React.addons.PureRenderMixin],
      propTypes: {
        tabRouteStitch: React.PropTypes.object.isRequired
      },
      getInitialState: function() {
        return {tab: this.props.tabRouteStitch.value.tab}
      },
      componentWillMount: function() {
        this.listener = this.props.tabRouteStitch.listen(({tab}) => {
          this.setState({tab})
        })
      },
      componentWillUnmount: function() {
        this.listener.stop()
      },
      render: function() {
        return (
          <div>
            <div className={this.state.tab == 'feed' ? 'selected' : ''}>FEED</div>
            <div className={this.state.tab == 'profile' ? 'selected' : ''}>PROFILE</div>
          </div>
        )
      }
    })

    function renderApp(initialRoute, instance) {
      var tabRouteStitch = createStitch(initialRoute)
      return (
        <div>
          <Tabbar tabRouteStitch={tabRouteStitch}/>
          <TabVC
            instance={instance}
            tabRouteStitch={tabRouteStitch}
            renderTab={renderTab}/>
        </div>
      )
    }

    Meteor.startup(function() {
      React.render(renderApp({tab:'feed'}, ReactInstance), document.body)
    })


## NavVC

NavVC has the following props:
- instance
- initialSceneRoute
- renderScene
- listenPush
- setPop
- listenPopFont
- className

initialSceneRoute the root view of the navigation stack. Similar to the TabVC,
`renderScene(route, instance)` expects a component to be returned. Its important
to realize that these scene routes are different from the tab routes of the
TabVC. Remember that routing isn't as simple as a linear browser history
anymore.

listenPush is a stitch listener to push routes onto the navigation stack.
listenPopFont is an optional stitch listener if you want to pop all the way
to the front of the stack.

setPop is a stitch setter that sets the value to either null if there aren't
any views to pop, or to a function that calls pop on the navigation controller.
You will typically use this to set the back button in your navbar.

className will set the class of the CSSTransitionGroup that wraps the views so
you can style it.

The NavVC can animate your views pushing and popping by dynamically setting
the transitionName of the CSSTransitionGroup. You must specify transitions
or else the components will not be removed from the DOM since transitionend
will never fire. Thus, here are some innate animations that will hardly do
anything but will allow everything to work:

    .navvc-appear-appear {
      opacity: 0.999;
    }
    .navvc-appear-appear.navvc-appear-appear-active {
      opacity: 1;
      transition: opacity .001s linear;
    }

    .navvc-push-enter {
      opacity: 0.999;
    }
    .navvc-push-enter.navvc-push-enter-active {
      opacity: 1;
      transition: opacity .001s linear;
    }
    .navvc-push-leave {
      opacity: 0.999;
    }
    .navvc-push-leave.navvc-push-leave-active {
      opacity: 1;
      transition: opacity .001s linear;
    }

    .navvc-pop-enter {
      opacity: 0.999;
    }
    .navvc-pop-enter.navvc-pop-enter-active {
      opacity: 1;
      transition: opacity .001s linear;
    }
    .navvc-pop-leave {
      opacity: 0.999;
    }
    .navvc-pop-leave.navvc-pop-leave-active {
      opacity: 1;
      transition: opacity .001s linear;
    }

And if you want some nice animations, here's a nice starting point for a basic
push/pop animation:

    // lets fade it in on appear
    .navvc-appear-appear {
      opacity: 0.1;
    }
    .navvc-appear-appear.navvc-appear-appear-active {
      opacity: 1;
      transition: opacity 0.1s ease;
    }

    // push animation
    .navvc-push-enter {
      z-index: 1;
      transform: translateX(100%);
    }
    .navvc-push-enter.navvc-push-enter-active {
      transform: translateX(0%);
      transition: transform .5s ease;
    }
    .navvc-push-leave {
      transform: translateX(0%);
    }
    .navvc-push-leave.navvc-push-leave-active {
      transform: translateX(-33%);
      transition: transform .5s ease;
    }

    // pop animation
    .navvc-pop-enter {
      transform: translateX(-33%);
    }
    .navvc-pop-enter.navvc-pop-enter-active {
      transform: translateX(0%);
      transition: transform .5s ease;
    }
    .navvc-pop-leave {
      transform: translateX(0%);
    }
    .navvc-pop-leave.navvc-pop-leave-active {
      transform: translateX(100%);
      transition: transform .5s ease;
    }

Lastly, a simple, hopefully not too contrived, NavVC example.

    var colors = ['red', 'green', 'blue', 'yellow', 'purple']

    var Navbar = React.createClass({
      displayName: 'Tabbar',
      mixins: [React.addons.PureRenderMixin],
      propTypes: {
        listenPop: React.PropTypes.func.isRequired,
        pushRoute: React.PropTypes.func.isRequired
      },
      getInitialState: function() {
        return {i: 0, back:false}
      },
      componentWillMount: function() {
        this.listener = this.props.listenPop((pop) => {
          if (pop) {
            this.setState({back:<div onClick={pop}>{'<'}</div>})
          } else {
            this.setState({back:false})
          }
        })
      },
      componentWillUnmount: function() {
        this.listener.stop()
      },
      push: function() {
        this.props.pushRoute({color:colors[i]})
        this.setState({i: (this.state.i + 1) % 4 })
      },
      render: function() {
        return (
          <div>
            {this.state.back}
            <div onClick={this.push}>{'>'}</div>
          </div>
        )
      }
    })

    function renderScene({color}, instance) {
      return <div style={{background:color}}></div>
    }

    function renderApp(instance) {
      var pushStitch = createStitch()
      var popStitch = createStitch()

      return (
        <div>
          <Navbar
            listenPop={popStitch.listen}
            pushRoute={pushStitch.set}/>
          <NavVC
            instance={instance}
            initialSceneRoute={{color:'black'}}
            renderScene={renderScene}
            listenPush={pushStitch.listen}
            setPop={popStitch.set}/>
        </div>
      )
    }

    Meteor.startup(function() {
      React.render(renderApp(ReactInstance), document.body)
    })

# Bells and Wistles

With all these animations going on, its helpful to debounce actions so they
don't end up clobbering each other. I've built a simple debouncer thats meant
to debounce all user interface actions.

    // global application debouncer
    debounce = createDebouncer(500) // 500 ms debounce

Then anywhere you're calling an action that animates, specifically the push
and pop animations, wrap those functions with the debouncer!

      <div onClick={debounce(this.push)}>{'>'}</div>
      <div onClick={debounce(this.pop)}>{'<'}</div>
