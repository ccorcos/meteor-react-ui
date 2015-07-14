foxes = [
  "http://i.imgur.com/Hs1IbE7.jpg",
  "http://i.imgur.com/H6qktcz.jpg",
  "http://i.imgur.com/VHkN3EF.jpg",
  "http://i.imgur.com/zUn3x6S.jpg",
  "http://i.imgur.com/2eeKVAm.jpg",
  "http://i.imgur.com/MiqPGGA.jpg",
  "http://i.imgur.com/adU2wwW.jpg",
  "http://i.imgur.com/YB9SqWG.jpg",
  "http://i.imgur.com/PPcV0d9.jpg",
  "http://i.imgur.com/11Et3yz.jpg"
]

whales = [
  "http://i.imgur.com/VLJOQr5.jpg",
  "http://i.imgur.com/1JzaSkb.jpg",
  "http://i.imgur.com/qoSFEkZ.jpg",
  "http://i.imgur.com/QLUGpps.jpg",
  "http://i.imgur.com/gNzyESv.jpg"
]

feeds = {foxes, whales}

Feed = React.createClass({
  displayName: 'Feed',
  mixins: [
    React.addons.PureRenderMixin,
    InstanceMixin
  ],
  propTypes: {
    kind: React.PropTypes.string.isRequired,
    setTitle: React.PropTypes.func.isRequired,
    setLeft: React.PropTypes.func.isRequired,
    setRight: React.PropTypes.func.isRequired,
  },
  fetch: function(n) {
    return feeds[this.props.kind].slice(0,n)
  },
  getInitialInstance: function() {
    return {limit: 1, imgs: this.fetch(1)}
  },
  instanceWillMount: function() {
    this.props.setTitle((this.props.kind == 'foxes' ? 'Fox' : 'Whale') + ' Feed')
    this.props.setLeft(null)
    this.props.setRight(null)
  },
  saveInstance: function(save) {
    // additionally save and restore the scroll position
    var state = this.state
    var scrollTop = this.getDOMNode().scrollTop
    save(function(ctx) {
      ctx.setState(state, function() {
        ctx.getDOMNode().scrollTop = scrollTop
      })
    })
  },
  loadMore: function() {
    this.setState({
      limit: this.state.limit + 1,
      imgs: this.fetch(this.state.limit + 1)
    })
  },
  render: function() {
    var imgs = this.state.imgs.map((src) => { return <img src={src} key={src}/> })
    var loadMore = this.state.imgs.length >= this.state.limit ? (<button onClick={this.loadMore}>LOAD MORE</button>) : false
    return (
      <div className="view">
        {imgs}
        {loadMore}
      </div>
    )
  }
})
