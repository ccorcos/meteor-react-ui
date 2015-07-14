// shallow clone
function clone(obj) {
  return React.addons.update(obj, {})
}

this.clone = clone
