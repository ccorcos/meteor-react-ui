
# components listen for save events while they're mounted
listeners = {}
listen = (f) ->
  id = Random.hexString(10)
  listeners[id] = f
  # they stop listening on unmount
  {stop: -> delete listeners[id]}
# trigger all components to save their state
ReactUI.save = ->
  for id, f of listeners
    f()

# Top-level React UI instance
ReactUI.instance = Meteor._reload.migrationData('react-ui-instance') or {}
Meteor._reload.onMigrate 'react-ui-instance', ->
  ReactUI.save()
  return [true, ReactUI.instance]

# @childInstance(name) will create a child instance for you
# @initializeInstance(instance) is called onMount and whenever a new instance is
# received as props.
# @save() should return an object to be saved on the instance
ReactUI.InstanceMixin =
  propTypes:
    instance: React.PropTypes.object.isRequired
  componentWillMount: ->
    @listener = listen(@saveInstance)
    @initializeInstance?(@props.instance)
  componentWillReceiveProps: (nextProps) ->
    if @props.instance isnt nextProps.instance
      @initializeInstance?(nextProps.instance)
  saveInstance: ->
    instance = @save?() or {}
    # mutable copy over the instance so the api can seem immutable using @save()
    for k,v of instance
      @props.instance[k] = v
  componentWillUnmount: ->
    @listener.stop()
    @saveInstance()
  childInstance: (name) ->
    @props.instance.childInstances = @props.instance.childInstances or {}
    childInstances = @props.instance.childInstances
    unless childInstances[name]
      childInstances[name] = {}
    return childInstances[name]
