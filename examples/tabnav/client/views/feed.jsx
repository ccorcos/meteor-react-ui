Feed = React.createClass({
  displayName: 'Feed',
  mixins: [
    React.addons.PureRenderMixin,
    InstanceMixin
  ],
  propTypes: {
    setTitle: React.PropTypes.func.isRequired,
    setLeft: React.PropTypes.func.isRequired,
    setRight: React.PropTypes.func.isRequired,
  },
  getInitialInstance: function() {
    return {toolbarOpen: false}
  },
  toggleToolbar: function() {
    this.setState({toolbarOpen:!this.state.toolbarOpen})
  },
  instanceWillMount: function() {
    this.props.setTitle('Feed')
    this.props.setLeft(null)
    this.props.setRight((
      <div className="toggle-toolbar" onClick={this.toggleToolbar}>
        TOOLS
      </div>
    ))
    this.props.instance && this.props.instance.restore(this)
  },
  render: function() {
    return (
      <div className="view feed">
        <div className={`toolbar ${this.state.toolbarOpen ? 'open' : ''}`}>
          TOOLBAR!
        </div>
        This is the feed page!
      </div>
    );
  }
});
