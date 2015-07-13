// for simplicity, we'll just append the users to the post.
// we could be more efficient and post them in a separate subscription
// but this hasnt been thoughtout and implements in Any-Db yet.
DB.publish({
  name: 'feed',
  cursor: function() {
    var pub = this;
    var postHandle = Posts.find().observeChanges({
      addedBefore: function(id, fields, before) {
        users = fields.userIds.map(function(userId) {
          return Users.findOne(userId)
        })
        delete fields['userIds']
        fields.users = users
        pub.addedBefore(id, fields, before)
      },
      changed: function(id, fields) {
        if (fields.userIds) {
          users = fields.userIds.map(function(userId) {
            return Users.findOne(userId)
          })
          delete fields['userIds']
          fields.users = users
        }
        pub.changed(id, fields)
      },
      movedBefore: function(id, before) {
        pub.movedBefore(id, before)
      },
      removed: function(id) {
        pub.removed(id)
      }
    })
    pub.onStop(function() {
      postHandle.stop()
    })
  }
})
