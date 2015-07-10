- TabController with tabs that maintain scroll position and state.
- NavController make sure maintains scroll position and state. 
- Global hooks example.
- all together with subscriptions.



// Start with a TabViewController Demo.
// See what happens in the render cycle with the components
// and make sure that they maintain scroll and state, etc.

// var TabController = React.createClass({
//   displayName: 'TabViewController',
//   propTypes: {
//     current: React.PropTypes.string.isRequired,
//     components: React.PropTypes.object.isRequired,
//   },
//   render() {
//     return this.props.components[this.props.current]
//   }
// })



// friend notifier app



// Need to map urls to components so we can change the URL, get the
// components and push to the nav controller. We can also handle 
// urls that go directly to a user or a event by 


// Global UI Hooks
Hooks = {}


var App = React.createClass({
  displayName: 'App',
  componentWillMount() {
    // When any of our views, render, this is how we hook into the layout.
    Hooks.setTitle = (title) => this.setState({title: title})
    Hooks.setOnBack = (func) => this.setState({onBack: func})
    Hooks.setOnToggleToolbar = (func) => this.setState({onToggleToolbar: func})
  }
  getInitialState() {
    return {
      currentTab: (this.props.currentTab || 'profile'),
      title: null,
      onBack: null,
      onToggleToolbar: null
    }
  }
  onTab(name) { 
    this.setState({currentTab: name})
  }
  render() {
    return (
      <Layout title={this.state.title} 
              onBack={this.state.onBack} 
              onToggleToolbar={this.state.onToggleToolbar}>
        <TabController selected={this.state.currentTab}>
          <Tab name="profile">
            <NavController>
              <Profile/>
            </NavController>
          </Tab>
          <Tab name="feed">
            <NavController>
              <Feed/>
            </NavController>
          </Tab>
          <Tab name="explore">
            <NavController>
              <Explore/>
            </NavController>
          </Tab>    
          <Tab name="other">
            {/* This if we land on a direct route, we can render here */}
            {this.props.children}
          </Tab>        
        </TabController>
      </Layout>
    )
  }
})

// all children of a navcontroller get push and pop.
// NavLayoutMixin checks to see if theres a parent nav NavController
// and wires up the onBack to the layout.
