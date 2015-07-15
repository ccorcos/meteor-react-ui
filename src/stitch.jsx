function counter() {
  var i = 0;
  return function() {
    i = (i+1)%1000000000
    return i
  }
}

// A "stitch" allows you to tie together React components.
// One way to use a stitch for setting the state of a React
// component from another component.

// titleStitch = createStitch('Optional Initial Title')
// setTitle = titleStitch.set
// laceTitle = titleStitch.lace

// Another way to is to call actions between components.

// logoutStitch = createStitch()
// logout = logoutStitch.call
// onLogout = logoutStitch.on


function createStitch(initialValue=null) {
  // each subscriber is assigned an id
  var newId = counter()

  var obj = {
    listeners: {},
    value: initialValue,
  }

  var updateListeners = function(value) {
    Object.keys(obj.listeners).map(function(id) {
      obj.listeners[id](value)
    })
  }

  obj.set = function(value) {
    obj.value = value
    updateListeners(value)
  }
  obj.on = function(func) {
    var id = newId()
    obj.listeners[id] = func
    return {stop: function() {
      delete obj.listeners[id]
    }}
  }

  return obj
}

var ListenerMixin = {
  componentWillMount: function() {
    this.listeners = []
  },
  addListener: function(handle) {
    this.listeners.push(handle)
  },
  stopListeners: function() {
    this.listeners.map(({stop}) => {stop()})
    this.listeners = []
  },
  componentWillUnmount: function() {
    this.stopListeners()
  }
}

this.createStitch = createStitch;
this.ListenerMixin = ListenerMixin;
