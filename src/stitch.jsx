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

saveStitch = createStitch()

this.save = saveStitch.set

this.UIMixin = {
  componentWillMount: function() {
    this.listeners = []
    this.save && this.listeners.push(saveStitch.listen(this.save))
  },
  componentWillUnmount: function() {
    this.listeners.map(({stop}) => {stop()})
    this.save && this.save()
  }
}


if (Meteor.isClient) {
  this.appInstance = Meteor._reload.migrationData('react-ui') || {}

  Meteor._reload.onMigrate('react-ui', function() {
    save()
    return [true, appInstance]
  })
}
