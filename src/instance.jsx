// An "instance" can be used to save a React component's state
// between renders so long as you pass the same instance prop.

function createInstance() {
  var obj = {
    func: null
  }
  obj.save = function(f) {
    obj.func = f
  }
  obj.restore = function(context) {
    obj.func && obj.func(context);
  }
  return obj
}

// this.saveInstance is a function wrapper used to override the defaultSave
// which only saves the state. It would be reasonable to use
// this override to set the scroll position to what it was before.
//
// this.getInitialInstance() is effectively this.setInitialState except
// only gets called when the instance is initialized.
//
// Note that its possible to replace one component with the same component
// that has a different instance. Thus, we can't rely only on componentWillMount
// and componentWillUnmount hooks.
var InstanceMixin = {
  propTypes: {
    instance: React.PropTypes.object.isRequired
  },
  defaultSave: function(f) {
    // save the state by default
    var state = this.state
    f(function(ctx) {
      ctx.setState(state)
    })
  },
  save: function() {
    // call the override method if it exists
    var f = this.props.instance.save
    this.saveInstance ? this.saveInstance(f) : this.defaultSave(f)
  },
  restore: function() {
    this.props.instance.restore(this)
  },
  getInitialState: function() {
    if (this.props.instance.func) {
      return {}
    } else {
      return this.getInitialInstance()
    }
  },
  componentWillMount: function() {
    this.restore()
  },
  componentWillUnmount: function() {
    this.save()
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.instance != this.props.instance) {
      this.save()
    }
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps.instance != this.props.instance) {
      this.replaceState(this.getInitialState())
      this.restore()
    }
  },
}

this.createInstance = createInstance;
this.InstanceMixin = InstanceMixin;
