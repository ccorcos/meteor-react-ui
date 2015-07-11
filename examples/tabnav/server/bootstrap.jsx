Meteor.startup(function() {
  if (Posts.find().count() == 0 && Users.find().count() == 0) {
    console.log('Seeding database...')
    function createUser() {
      Users.insert({
        username: faker.internet.userName(),
        image: faker.image.avatar()
      })
    }
    // create 50 users
    R.map(createUser, R.range(0,50))
    userIds = R.pluck('_id', Users.find().fetch())
    function randomUserId() {
      return Random.choice(userIds)
    }
    function createPost() {
      // each post has between 1 and 3 authors
      n = Random.choice(R.range(1,4))
      uIds = R.uniq(R.map(randomUserId, R.range(0,n)))
      Posts.insert({
        title: faker.lorem.words(Random.choice(R.range(3,8))),
        image: faker.image.image()
      })
    }
    // create 50 posts
    R.map(createPost, R.range(0,50))
    console.log('...done')
  }
})
