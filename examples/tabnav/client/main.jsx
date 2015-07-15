

function renderApp(initialRoute, instance) {
  // console.log("render app", initialRoute, instance)

  // these are some global app layout stitches
  var titleStitch = createStitch('')
  var leftStitch = createStitch()
  var rightStitch = createStitch()
  var tabRouteStitch = createStitch(initialRoute)

  function renderTab(tabRoute, tabInstance) {
    // console.log("render tab", tabRoute, tabInstance)


    // every tab has a navigation controller, so we need to wire it up
    // with all of its scene.
    var pushStitch = createStitch(null)

    function renderScene(sceneRoute, sceneInstance) {
      // console.log("render scene", sceneRoute, sceneInstance)

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
        return <Item kind="foxes" id={Number(sceneRoute.params.id)} {...props}/>;
      } else if (name == "/whales/:id") {
        return <Item kind="whales" id={Number(sceneRoute.params.id)} {...props}/>;
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

    var {tab, name, path} = tabRoute

    var props = {
      renderScene: renderScene,
      listenPush: pushStitch.listen,
      setPop: handlePop,
      instance: tabInstance
    }

    if (tab == "foxes") {
      return <NavVC key="nav-foxes" initialSceneRoute={{tab:'foxes', path:'/', name:'/'}} {...props}/>
    } else if (tab == "whales") {
      return <NavVC key="nav-whales" initialSceneRoute={{tab:'whales', path:'/whales', name:'/whales'}} {...props}/>
    } else if (tab == "hidden") {
      if (name == "/foxes/:id" || name == "/whales/:id") {
        return <NavVC key="nav-hidden" initialSceneRoute={tabRoute} {...props}/>
      } else {
        return <NotFound path={path}/>
      }
    }
  }

  var setFeedTab = () => tabRouteStitch.set({tab:'foxes'})
  var setProfileTab = () => tabRouteStitch.set({tab:'whales'})
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
      rightComponentStitch={rightStitch}
      tabButtons={tabButtons}>
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
  save: function() {
    Session.set('instance', this.instance)
  },
  componentWillMount: function() {
    this.instance = Session.get('instance')
  },
  componentWillUnmount: function() {
    window.setTimeout(() => {
      console.log("app save")
      Session.set('instance', this.instance)
    }, 0)
  },
  render: function() {
    return renderApp(this.props.initialRoute, this.instance)
  }
});
