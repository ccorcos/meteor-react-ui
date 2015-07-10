User = React.createClass({
  displayName: 'User',
  propTypes: {
    route: React.PropTypes.object.isRequired
    navVC: React.PropTypes.object.isRequired
    tabVC: React.PropTypes.object.isRequired
  },
  componentWillMount() {
    Router.go(this.props.route.path)
  }
  render() {
    return (
      <div>User</div>
    )
  }
})
