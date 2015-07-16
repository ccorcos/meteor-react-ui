
var saveReactInstanceDispatcher = createDispatcher()

this.saveReactInstance = saveReactInstanceDispatcher.dispatch

// this mixin handles stopping stitch listeners and saving the component
this.InstanceMixin = {
  componentWillMount: function() {
    if (this.save) {
      this.saveListener = saveReactInstanceDispatcher.register(this.save)
    }
  },
  componentWillUnmount: function() {
    this.saveListener && this.saveListener.stop()
    this.save && this.save()
  }
}

// the global instance of the app
this.ReactInstance = Meteor._reload.migrationData('react-ui') || {}

Meteor._reload.onMigrate('react-ui', function() {
  saveReactInstance()
  return [true, ReactInstance]
})
