function counter() {
  var i = 0;
  return function() {
    i = (i+1)%1000000000
    return i
  }
}

function createDispatcher() {
  var newId = counter()
  var listeners = {}

  return {
    register: function(func) {
      var id = newId()
      listeners[id] = func
      return {
        stop: () => {
          delete listeners[id]
        }
      }
    },
    dispatch: function(value) {
      Object.keys(listeners).map((id) => {
        listeners[id](value)
      })
    }
  }
}

this.createDispatcher = createDispatcher
