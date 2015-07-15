Item = React.createClass({
  displayName: 'Item',
  mixins: [
    React.addons.PureRenderMixin,
    InstanceMixin,
    SaveScrollTopMixin
  ],
  propTypes: {
    setTitle: React.PropTypes.func.isRequired,
    path: React.PropTypes.string.isRequired,
    kind: React.PropTypes.string.isRequired,
    id: React.PropTypes.number.isRequired,
  },
  setTitle: function(props) {
    props.setTitle(`${props.kind}[${props.id}]`)
  },
  componentWillMount: function() {
    this.setTitle(this.props)
  },
  instanceWillUpdate: function(props, state) {
    this.setTitle(props)
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
