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
  mixins: [React.addons.PureRenderMixin, InstanceMixin],
  propTypes: {
    instance: React.PropTypes.object.isRequired,
    kind: React.PropTypes.string.isRequired,
    path: React.PropTypes.string.isRequired,
    push: React.PropTypes.func.isRequired,
    setTitle: React.PropTypes.func.isRequired,
  },
  fetch: function(n, kind) {
    return feeds[kind].slice(0,n)
  },
  getInitialState: function() {
    if (this.props.instance.state) {
      return this.props.instance.state
    } else {
      return {limit: 1, imgs: this.fetch(1, this.props.kind)}
    }
  },
  componentWillMount: function() {
    this.props.setTitle((this.props.kind == 'foxes' ? 'Fox' : 'Whale') + ' Feed')
    Router.go(this.props.path)
  },
  componentDidMount: function() {
    if (this.props.instance.scrollTop) {
      this.getDOMNode().scrollTop = this.props.instance.scrollTop
    }
  },
  save: function() {
    this.props.instance.state = this.state
    this.props.instance.scrollTop = this.getDOMNode().scrollTop
  },
  loadMore: function() {
    this.setState({
      limit: this.state.limit + 1,
      imgs: this.fetch(this.state.limit + 1, this.props.kind)
    })
  },
  render: function() {
    var imgs = this.state.imgs.map((src, i) => {
      return <img src={src} key={src} onClick={debounce(() => {
          this.props.push({
            name:`/${this.props.kind}/:id`,
            path: `/${this.props.kind}/${i}`,
            params: {id:i}
          })
        })}/>
    })
    var loadMore = this.state.imgs.length >= this.state.limit ? (<button onClick={debounce(this.loadMore)}>LOAD MORE</button>) : false
    return (
      <div className="view">
        {imgs}
        {loadMore}
      </div>
    )
  }
})
