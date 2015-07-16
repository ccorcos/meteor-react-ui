
var saveReactInstanceStitch = createStitch()

this.saveReactInstance = saveReactInstanceStitch.set

// this mixin handles stopping stitch listeners and saving the component
this.ReactInstanceMixin = {
  componentWillMount: function() {
    this.listeners = []
    this.save && this.listeners.push(saveReactInstanceStitch.listen(this.save))
  },
  componentWillUnmount: function() {
    this.listeners.map(({stop}) => {stop()})
    this.save && this.save()
  }
}

// the global instance of the app
this.ReactInstance = Meteor._reload.migrationData('react-ui') || {}

Meteor._reload.onMigrate('react-ui', function() {
  saveReactInstance()
  return [true, ReactInstance]
})
