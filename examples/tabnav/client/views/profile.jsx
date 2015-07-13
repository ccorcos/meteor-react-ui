Profile = React.createClass({
  displayName: 'Profile',
  mixins: [
    React.addons.PureRenderMixin,
    InstanceMixin
  ],
  propTypes: {
    setTitle: React.PropTypes.func.isRequired,
    setLeft: React.PropTypes.func.isRequired,
    setRight: React.PropTypes.func.isRequired,
  },
  instanceWillMount: function() {
    this.props.setTitle('Profile')
    this.props.setLeft(null)
    this.props.setRight(null)
  },
  render: function() {
    console.log("render Profile")
    return (
      <div className="view profile">
        This is the profile.
      </div>
    );
  }
});
