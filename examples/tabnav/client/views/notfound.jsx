NotFound = React.createClass({
  displayName: 'NotFound',
  propTypes: {
    path: React.PropTypes.string.isRequired,
  },
  componentWillMount: function() {
    Router.go(this.props.path)
  },
  render: function() {
    return (
      <div>404: NotFound</div>
    );
  }
});
