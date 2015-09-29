# React UI

## Background

Background -- read the medium articles!

---

An instance is a mutable object passed as props which is mutated to save the state of
the component so it can be restored. Here are some example of the concept (without
even using this package):

```jsx
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
```

## API

The top-level instance for your entire app is `ReactInstance` which should be
passed to the top-level component as the `instance` prop.

```jsx
var App = React.createClass({
  displayName: 'App',
  mixins: [React.addons.PureRenderMixin, InstanceMixin],
  initializeInstance: function(instance) {
    this.getDOMNode().scrollTop = instance.scrollTop || 0
  },
  save: function() {
    return {scrollTop: this.getDOMNode().scrollTop}
  },
  render: function() {
    return <div><Counter={this.childInstance('counter')}</div>
  }
})
```

Then you can verify that its working by triggering a hot-reload:

```js
Meteor._reload.reload()
```
