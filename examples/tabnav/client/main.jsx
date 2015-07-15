

function renderApp(initialRoute, instance) {

  // these are some global app layout stitches
  var titleStitch = createStitch('')
  var leftStitch = createStitch()
  var rightStitch = createStitch()
  var tabRouteStitch = createStitch(initialRoute)

  function renderTab(tabRoute, tabInstance) {

    // every tab has a navigation controller, so we need to wire it up
    // with all of its scene.
    var pushStitch = createStitch(null)

    function renderScene(sceneRoute, sceneInstance) {
      var {name, path} = sceneRoute

      var props = {
        setTitle: titleStitch.set,
        push: pushStitch.set,
        path: path,
        key: path, // shouldnt be pushing from on path to the same
        instance: sceneInstance
      }

      if (name == '/') {
        return <Feed kind="foxes" {...props}/>
      } else if (name == '/whales') {
        return <Feed kind="whales" {...props}/>
      } else if (name == "/foxes/:id") {
        return <Item kind="foxes" id={Number(tabRoute.params.id)} {...props}/>;
      } else if (name == "/whales/:id") {
        return <Item kind="whales" id={Number(tabRoute.params.id)} {...props}/>;
      } else {
        return <NotFound key={path} path={path}/>;
      }
    }

    function handlePop(pop) {
      if (pop) {
        leftStitch.set(<div className="back-button" onClick={debounce(pop)}>{"<"}</div>)
      } else {
        leftStitch.set(null)
      }
    }

    var props = {
      renderScene: renderScene,
      listenPush: pushStitch.listen,
      setPop: handlePop,
      instance: tabInstance
    }

    if (tabRoute.tab == "foxes") {
      <NavVC key="nav-foxes" initialScene={{tab:'foxes', path:'/', name:'/'}} {...props}/>
    } else if (tabRoute.tab == "whales") {
      <NavVC key="nav-whales" initialScene={{tab:'whales', path:'/whales', name:'/whales'}} {...props}/>
    } else if (tabRoute.tab == "hidden") {
      if (name == "/foxes/:id" || name == "/whales/:id") {
        return <NavVC key="nav-hidden" initialScene={tabRoute} {...props}/>
      } else {
        return <NotFound path={route.path}/>
      }
    }
  },

  var setFeedTab = () => currentTabStitch.set({tab:'foxes'})
  var setProfileTab = () => currentTabStitch.set({tab:'whales'})
  var tabButtons = [{
    name: 'foxes',
    component: <div onClick={debounce(setFeedTab)}>FOX</div>
  },{
    name: 'whales',
    component: <div onClick={debounce(setProfileTab)}>WHALE</div>
  }]

  return (
    <Layout
      titleStitch={titleStitch}
      tabRouteStitch={tabRouteStitch}
      leftComponentStitch={leftStitch}
      rightComponentStitch={rightStitch}>
      tabButtons={tabButtons}
      <TabVC
        key="tab-vc"
        tabRouteStitch={tabRouteStitch}
        renderTab={renderTab}
        instance={instance}/>
    </Layout>
  )
}


Session.setDefault('instance', {})

App = React.createClass({
  displayName: 'App',
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    initialRoute: React.PropTypes.object.isRequired
  },
  componentDidMount: function() {
    this.instance = Session.get('instance')
  },
  componentWillUnmount: function() {
    Session.set('instance', this.instance)
  },
  render: function() {
    renderApp(this.props.initialRoute, this.instance)
  }
});
