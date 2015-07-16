# React View Controllers

This package contains two view controllers, TabVC and NavVC, that imitate their
iOS counterparts, UITabBarController and UINavigationController.

In addition, this package provides a pattern for saving the instances of your
views so they can be restored between mounts and serialized and restored during
live-reloads / hot-code-pushes.

To get started, add this package to your project:

    meteor add ccorcos:react-ui

This will imply the `react-runtime` package for you, or you can add it
separately. If you want to use babel/jsx, you should add the `jsx` pacakge
as well.

# Concepts

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
do not unmount your components so we have a global event to trigger a save.
Using the `InstanceMixin`, all you have to do is define a `save` function
which will be called on the `componentWillUnmount` and whenever
`saveReactInstance` is called such as on live-reloads. This package also
defines a top-level mutable `ReactInstance` for you which is serialized between
live-reloads.

Here's how you might use it:

    var Counter = React.createClass({
      displayName: 'Counter',
      mixins: [React.addons.PureRenderMixin, InstanceMixin],
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
- all components with unique instances must also have a unique key.

## Dispatcher

This package comes with a very simple dispatcher for handling events. It works
like this:

    var eventDispatcher = createDispatcher()

    eventDispatcher.register(function(value) {
      console.log(value)
    })

    eventDispatcher.dispatch(10)
    // => 10

As discussed [here](http://revelry.co/development/2014/11/10/react-faq-component-talk/)
this is useful when you want to signal a component but don't know where its coming
from before hand. For example, with the NavVC, you don't know if the push event
is going to come from the parent, child, or sibling component. Thus a dispatcher
allows all for all of the above.

# Components

This package comes with two view controller components that are ubiquitous
in mobile apps: TabVC and NavVC. TabVC is inspired by the iOS
UITabBarController and NavVC is inspired by the iOS UINavigationController.
I use the term "view controller" because all they do is control which view /
component is rendered.

**Routing**
Before diving into these view controllers, one thing to notice is that routing
isn't as simple as a simple browser history. Imagine a classical tab-nav app
like Instagram. Each tab has its own navigation history that is remembers when
you switch between tabs. This state of the app cannot (or shouldn't) be
maintained entirely in the URL. Thus, we cannot use the router as the primary
view controller as we're used to doing in the web. Instead, we use the router
to determine the entry point of the program. We can set the route and push to
the browser history so the user can copy paste a link, but we're not using the
router to render the next view. Instead we'll be using TabVC and NavVC.

## TabVC

TabVC is quite simple. It has 3 props.
- instance
- currentTab
- renderTab

The `currentTab` is a string. TabVC will create and cache an instance for that
tab and call `renderTab(tabName, tabInstance)`.

There is one special tab, called "hidden". The TabVC will create an instance
for this tab, but as soon as you navigate to another tab, this instance will
be thrown away. This is useful if the user lands on a page via direct link and
you want to display it but don't have a specific tab for it.

## NavVC

NavVC has the following props:
- instance
- rootScene
- renderScene
- registerPush
- registerPopFront
- setPop
- className

The `rootScene` is an object specifying the root view of the navigation stack.
NavVC will create an instance for each view pushed to the stack and call
`renderScene(sceneRoute, sceneInstace)` with the scene route and instance.

Because we can't be sure exactly how you'll want to push views onto the
navigation controller, I've set it up so you can use a Dispatcher to send
push and popFront events to the NavVC from anywhere in your app. Simply pass
the dispatcher.register function.

Also, setPop is a function that will be called with a pop function as an
argument whenever the navigation stack has more than one view on it, or with
null when theres only one view. You can use this hook to set up a back button
wherever you please.

className will set the class of the CSSTransitionGroup that wraps the views so
you can style it.

The NavVC can animate your views pushing and popping by dynamically setting
the transitionName of the CSSTransitionGroup. You must specify transitions
or else the components will not be removed from the DOM since transitionend
will never fire. Thus, here are some inert animations that will hardly do
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

# Bells and Wistles

With all these animations going on, its helpful to debounce actions so they
don't end up clobbering each other. I've built a simple debouncer thats meant
to be used to debounce all user interface actions.

    // global application debouncer
    debounce = createDebouncer(500) // 500 ms debounce

Then anywhere you're calling an action that animates, specifically the push
and pop animations, wrap those functions with the debouncer!

      <div onClick={debounce(this.pop)}>{'<'}</div>

There are a plethora of routers out there. But we don't need all of the
functionality of IronRouter or FlowRouter. I built the `ccorcos:client-router`
package as a barebones router that you can use simply as an entry point to your
program. Check out the tabnav example to see how I use it.

# To Do

- lazy load images