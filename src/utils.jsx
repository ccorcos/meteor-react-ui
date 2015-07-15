// shallow clone
function clone(obj) {
  return React.addons.update(obj, {})
}

function createDebouncer(ms) {
  var busy = false;
  return function(f) {
    return function() {
      if (!busy) {
        busy = true
        f()
        window.setTimeout(function() {
          busy = false
        }, ms)
      }
    }
  }
}

this.clone = clone
this.createDebouncer = createDebouncer
