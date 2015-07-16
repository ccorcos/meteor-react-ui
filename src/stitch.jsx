function counter() {
  var i = 0;
  return function() {
    i = (i+1)%1000000000
    return i
  }
}

this.createStitch = function createStitch(initialValue=null) {
  // each subscriber is assigned an id so we can stop it
  var newId = counter()

  var obj = {
    listeners: {},
    value: initialValue,
  }

  obj.set = function(value) {
    obj.value = value
    // update listeners with the new value
    Object.keys(obj.listeners).map(function(id) {
      obj.listeners[id](value)
    })
  }

  obj.listen = function(func) {
    var id = newId()
    obj.listeners[id] = func
    return {
      stop: function() {
        delete obj.listeners[id]
      }
    }
  }
  return obj
}
