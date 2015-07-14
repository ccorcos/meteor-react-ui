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
    laces: {},
    calls: {},
    value: initialValue,
  }

  var updateLaces = function(value) {
    Object.keys(obj.laces).map(function(id) {
      obj.laces[id](value)
    })
  }

  var updateCalls = function(args) {
    Object.keys(obj.calls).map(function(id) {
      obj.calls[id].apply(null, args)
    })
  }

  obj.set = function(value) {
    obj.value = value
    updateLaces(value)
  }
  obj.lace = function(func) {
    var id = newId()
    obj.laces[id] = func
    func(obj.value)
    return {stop: function() {
      delete obj.laces[id]
    }}
  }

  obj.call = function() {
    updateCalls(arguments)
  }
  obj.on = function(func) {
    var id = newId()
    obj.calls[id] = func
    return {stop: function() {
      delete obj.calls[id]
    }}
  }

  return obj
}

var StitchMixin = {
  componentWillMount: function() {
    this.stitches = []
  },
  stitch: function(handle) {
    this.stitches.push(handle)
  },
  componentWillUnmount: function() {
    this.stitches.map(({stop}) => {stop()})
  }
}

this.createStitch = createStitch;
this.StitchMixin = StitchMixin;
