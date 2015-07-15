
App = React.createClass({
  displayName: 'App',
  mixins: [
    React.addons.PureRenderMixin,
  ],
  propTypes: {
    initialRoute: React.PropTypes.object.isRequired
  },
  componentWillMount: function() {
    this.titleStitch = createStitch('')
    this.leftStitch = createStitch(null)
    this.rightStitch = createStitch(null)
    this.currentTabStitch = createStitch(this.props.initialRoute)
    var setFeedTab = () => this.currentTabStitch.set({tab:'foxes'})
    var setProfileTab = () => this.currentTabStitch.set({tab:'whales'})
    this.tabs = [{
      name: 'foxes',
      component: <div onClick={debounce(setFeedTab)}>FOX</div>
    },{
      name: 'whales',
      component: <div onClick={debounce(setProfileTab)}>WHALE</div>
    }]
    this.tabVCInstance = createInstance()

    // stitch the back button up
    this.backStitch = createStitch(null)
    this.backStitch.on((pop) => {
      if (pop) {
        this.leftStitch.set(<div className="back-button" onClick={debounce(pop)}>{"<"}</div>)
      } else {
        this.leftStitch.set(null)
      }
    })
  },

  renderTab: function(route) {
    var tab = route.tab

    // for each tab, we need to stitch it into the Layout
    var pushStitch = createStitch()

    var renderScene = (route) => {
      var props = {
        setTitle: this.titleStitch.set,
        push: pushStitch.set,
        path: route.path,
      }

      if (route.path == "/" || route.path == "/whales") {
        return <Feed key={route.path} kind={tab} instance={createInstance()} {...props}/>
      } else if (route.name == "/foxes/:id") {
        return <Item key={route.path} kind="foxes" instance={createInstance()} id={Number(route.params.id)} {...props}/>;
      } else if (route.name == "/whales/:id") {
        return <Item key={route.path} kind="whales" instance={createInstance()} id={Number(route.params.id)} {...props}/>;
      } else {
        return <NotFound key={route.path} path={route.path}/>;
      }
    }

    // If we're rendering a certain tab, then lets set the
    // initial scene path.
    if (tab == 'foxes') {
      route.path = '/'
    } else if (tab == 'whales') {
      route.path = '/whales'
    }

    // create an instance for the NavVC
    var props = {
      instance: createInstance(),
      initialScene: route,
      renderScene: renderScene,
      onPush: pushStitch.on,
      setBack: this.backStitch.set
    }

    if (tab == "foxes") {
      return <NavVC key="nav-foxes" {...props}/>
    } else if (tab == "whales") {
      return <NavVC key="nav-whales" {...props}/>
    } else {
      if (route.name == "/foxes/:id" || route.name == "/whales/:id") {
        return <NavVC key="nav-other" {...props}/>
      } else {
        return <NotFound path={route.path}/>
      }
    }
  },
  render: function() {
    return (
      <Layout
        titleStitch={this.titleStitch}
        currentTabStitch={this.currentTabStitch}
        tabs={this.tabs}
        leftComponentStitch={this.leftStitch}
        rightComponentStitch={this.rightStitch}>
        <TabVC
          key="tabVC"
          currentTabStitch={this.currentTabStitch}
          renderTab={this.renderTab}
          instance={this.tabVCInstance}/>
    </Layout>
    );
  }
});
