// An "instance" can be used to save a React component's state
// between renders so long as you pass the same instance prop.

// quirks:
// - in willMount, the state will be updated before render, but
//   the state will not be updated within the method. So anything
//   reacting to the state needs to happen in render or didMount.
// - a workaround would be to create your own custom save/restore
//   function using saveInstance. Then you can react to the new state
//   before the next render.


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

var noop = (function(){})

// API
// - save(stateObj, (context) -> null)
// - restoreState(context)
// - restoreUI(context)
function createInstance() {
  var obj = {
    state: null,
    ui: null,
  }
  obj.save = function(state, ui) {
    obj.state = state
    obj.ui = ui || noop
  }
  obj.restoreState = function(context, done=noop) {
    if (obj.state) {
      context.setState(obj.state, done)
    }
  }
  obj.restoreUI = function(context) {
    obj.ui && obj.ui(context);
  }
  return obj
}

// API:
// - getInitialInstanceState(props)
// - saveUI: -> (context) -> null
// - instanceWillUpdate(props, state)
// - instanceDidUpdate()

var InstanceMixin = {
  propTypes: {
    instance: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    // the state should be there in componentWillMount
    if (this.props.instance.state) {
      return this.props.instance.state
    } else {
      return (this.getInitialInstanceState
        ? this.getInitialInstanceState(this.props)
        : {})
    }
  },
  componentDidMount: function() {
    this.props.instance.restoreUI(this)
  },
  componentWillReceiveProps: function(nextProps) {
    console.log(nextProps)
    var nextInstance = nextProps.instance
    if (nextInstance != this.props.instance) {
      // save the current instance
      this.props.instance.save(this.state, this.saveUI && this.saveUI())
      // get the new instance's state
      var nextState = (nextInstance.state
        ? nextInstance.state
        : (this.getInitialInstanceState
          ? this.getInitialInstanceState(nextProps)
          : {}))
      this.replaceState(nextState)
      // call the API hook
      this.instanceWillUpdate && this.instanceWillUpdate(nextProps, nextState)
    }
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps.instance != this.props.instance) {
      this.props.instance.restoreUI(this)
      // call the API hook
      this.instanceDidUpdate && this.instanceDidUpdate()
    }
  },
  componentWillUnmount: function() {
    this.props.instance.save(this.state, this.saveUI && this.saveUI())
  },
}

var SaveScrollTopMixin = {
  saveUI: function() {
    var scrollTop = this.getDOMNode().scrollTop
    return function(ctx) {
      ctx.getDOMNode().scrollTop = scrollTop
    }
  },
}

this.createInstance = createInstance;
this.InstanceMixin = InstanceMixin;
this.SaveScrollTopMixin = SaveScrollTopMixin;
