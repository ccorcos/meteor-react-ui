Item = React.createClass({
  displayName: 'Item',
  mixins: [React.addons.PureRenderMixin  ],
  propTypes: {
    instance: React.PropTypes.object.isRequired,
    setTitle: React.PropTypes.func.isRequired,
    path: React.PropTypes.string.isRequired,
    kind: React.PropTypes.string.isRequired,
    id: React.PropTypes.number.isRequired,
  },
  componentWillMount: function() {
    this.props.setTitle(`${this.props.kind}[${this.props.id}]`)
    Router.go(this.props.path)
  },
  componentDidMount: function() {
    if (this.props.instance.scrollTop) {
      this.getDOMNode().scrollTop = this.props.instance.scrollTop
    }
  },
  componentWillUnmount: function() {
    this.props.instance.state = this.state
    this.props.instance.scrollTop = this.getDOMNode().scrollTop
  },
  render: function() {
    var src = feeds[this.props.kind][this.props.id]
    return (
      <div className="view">
        <img src={src} key={src}/>
      </div>
    );
  }
});
