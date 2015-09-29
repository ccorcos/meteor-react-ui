
React.initializeTouchEvents(true)

# Add listener to get :active pseudoselector working. hack
document.addEventListener("touchstart", (()->), false)

# debounce all function calls through one debouncer
# which drops function calls when its called too fast.
# very useful to prevent the user from spamming your app
# and breaking animations
createDebouncer = (ms) ->
  busy = false
  return (f) ->
    return (args...) =>
      if not busy
        busy = true
        f.apply(this, args)
        Meteor.setTimeout ->
          busy = false
        , ms

# global application debouncer
if Meteor.settings.public?.ui_debounce_ms
  ReactUI.debounce = createDebouncer(Meteor.settings.public?.ui_debounce_ms)
else
  ReactUI.debounce = R.identity

# Use components like functions!
ReactUI.createView = (spec) -> React.createFactory(React.createClass(spec))

# used all the time with inputs
ReactUI.blurOnEnterTab = (e) ->
  if e.key is "Tab" or e.key is "Enter"
    e.preventDefault()
    e.target.blur()
  return e

# a not-so-simple callback waiting for the async user login to resolve
ReactUI.waitForUser = (callback) ->
  Tracker.afterFlush ->
    Tracker.autorun (c) ->
      unless Meteor.loggingIn()
        c.stop()
        Tracker.nonreactive ->
          callback(Meteor.user())

# for interfacing with Meteor
ReactUI.AutorunMixin =
  componentWillMount: ->
    @autoruns = []
  componentWillUnmount: ->
    @autoruns.map ({stop}) -> stop()
  autorun: (f) ->
    @autoruns.push(Tracker.autorun(f))


# hesitate to call a function and return a cancel function.
# this is useful when you have an async operation that may happen very
# quickly so you may want to skip the loading animation.
ReactUI.hesitate = (ms, f) ->
  id = Meteor.setTimeout(f, ms)
  return -> Meteor.clearTimeout(id)

# force an async function to timeout after some ms
ReactUI.timeoutCallback = (ms, f) ->
  called = false
  id = Meteor.setTimeout ->
    called = true
    f?(null, new Meteor.Error(600, 'Timed out'))
  , ms
  (args...) ->
    unless called
      Meteor.clearTimeout(id)
      f?.apply(null, args)
