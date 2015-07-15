function counter() {
  var i = 0;
  return function() {
    i = (i+1)%1000000000
    return i
  }
}

this.createStitch = function createStitch(initialValue=null) {
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
  obj.listen = function(func) {
    var id = newId()
    obj.listeners[id] = func
    return {stop: function() {
      delete obj.listeners[id]
    }}
  }
  return obj
}
