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
  getInstance: function() {
    if (!this.props.instance) {
      console.error('You need to specify and instance prop:', this.constructor.displayName)
    } else {
      return this.props.instance
    }
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
    var f = this.getInstance().save
    this.saveInstance ? this.saveInstance(f) : this.defaultSave(f)
  },
  restore: function() {
    this.getInstance().restore(this)
  },
  getInitialState: function() {
    if (this.getInstance().func) {
      return {}
    } else {
      return (this.getInitialInstance && this.getInitialInstance()) || {}
    }
  },
  componentWillMount: function() {
    this.restore()
    this.instanceWillMount && this.instanceWillMount()
  },
  componentWillUnmount: function() {
    this.save()
    this.instanceWillUnmount && this.instanceWillUnmount()
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.instance != this.getInstance()) {
      this.save()
      this.instanceWillUnmount && this.instanceWillUnmount()
    }
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps.instance != this.getInstance()) {
      this.replaceState(this.getInitialState())
      this.restore()
      this.instanceWillMount && this.instanceWillMount()
    }
  },
}

this.createInstance = createInstance;
this.InstanceMixin = InstanceMixin;
