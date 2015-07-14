// - componentWillMount
//   - instanceWillMount
// - componentDidMount
//   - instanceDidMount
// - componentWillUnmount
//   - instanceWillUnmount




// - getInitialInstanceState(props)
// - saveInstance(function(save) { save(this.state, function() { /* update UI */})})
// - instanceWillUpdate(props, state)
// - instanceDidUpdate()




// An "instance" can be used to save a React component's state
// between renders so long as you pass the same instance prop.

// quirks:
// - in willMount, the state will be updated before render, but
//   the state will not be updated within the method. So anything
//   reacting to the state needs to happen in render or didMount.
// - a workaround would be to create your own custom save/restore
//   function using saveInstance. Then you can react to the new state
//   before the next render.

var noop = (function(){})

function createInstance() {
  var obj = {
    canRestore: false,
    onWillMount: null,
    onDidMount: null,
  }
  obj.save = function(f1=noop, f2=noop) {
    obj.onWillMount = f1
    obj.onDidMount = f2
    obj.canRestore = true
  }
  obj.restoreWillMount = function(context) {
    obj.onWillMount && obj.onWillMount(context);
  }
  obj.restoreDidMount = function(context) {
    obj.onDidMount && obj.onDidMount(context);
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

var debug = function() {
  console.log.apply(console, [
    "Instance",
    this.constructor.displayName,
    ':'
  ].concat(Array.prototype.slice.call(arguments)))
}
//var debug = (()=>{})

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
  save: function(instance) {
    debug.call(this, 'save')
    var f = instance.save
    // call override if it exists
    this.saveInstance ? this.saveInstance(f) : this.defaultSave(f)
  },
  restoreWillMount: function(instance) {
    if (instance.canRestore) {
      debug.call(this, 'restoreWillMount')
      instance.restoreWillMount(this)
    }
  },
  restoreDidMount: function(instance) {
    if (instance.canRestore) {
      debug.call(this, 'restoreDidMount')
      instance.restoreDidMount(this)
    }
  },
  initialState: function(instance, props) {
    if (instance.canRestore) {
      return {}
    } else {
      debug.call(this, 'getInitialInstance')
      return (this.getInitialInstance && this.getInitialInstance(props)) || {}
    }
  },
  getInitialState: function() {
    return this.initialState(this.props.instance, this.props)
  },
  defineHook: function(name) {
    var hooks = []
    this[name + 'Hooks'] = hooks
    this[name + 'Hook'] = (f) => { hooks.push(f) }
  },
  callHook: function(name, args...) {
    debug.call(this, name)
    this[name + 'Hooks'].map(function(f){ f.apply(this, args)})
    this[name] && this[name]()
  },
  componentWillMount: function() {
    this.defineHook('instanceWillMount')
    this.defineHook('instanceDidMount')
    this.defineHook('instanceWillUnmount')

    // stitch instance mixin
    this.instanceWillMountHook((this.props) => {
      this.stitches = []
    })
    this.instanceWillUnmountHook(() => {
      this.stitches.map(({stop}) => {stop()})
    })
    this.stitch = (handle) => {
      this.stitches.push(handle)
    }

    debug.call(this, 'componentWillMount')
    // the callback wont fire here because its before render!
    this.restoreWillMount(this.props.instance)
    this.callHook('instanceWillMount')

  },
  componentDidMount: function() {
    debug.call(this, 'componentDidMount')
    this.restoreDidMount(this.props.instance)
    this.callHook('instanceDidMount')
  },
  componentWillUnmount: function() {
    debug.call(this, 'componentWillUnmount')
    this.save(this.props.instance)
    this.callHook('instanceWillUnmount')
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.instance != this.props.instance) {
      debug.call(this, 'new instance')
      this.save(this.props.instance)
      this.callHook('instanceWillUnmount')

      this.replaceState(this.initialState(newProps.instance, newProps))
      this.restoreWillMount(newProps.instance)
      this.callHook('instanceWillMount')
    }
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps.instance != this.props.instance) {
      this.restoreDidMount(this.props.instance)
      this.callHook('instanceDidMount')
    }
  },
}

var SaveScrollTopMixin = {
  saveInstance: function(save) {
    var state = this.state
    var scrollTop = this.getDOMNode().scrollTop
    debug.call(this, "save scroll top", scrollTop)
    save(function(ctx) {
      ctx.setState(state)
    }, function(ctx) {
      debug.call(ctx, "restore scroll top", scrollTop)
      ctx.getDOMNode().scrollTop = scrollTop
    })
  },
}


this.createInstance = createInstance;
this.InstanceMixin = InstanceMixin;
this.SaveScrollTopMixin = SaveScrollTopMixin;
