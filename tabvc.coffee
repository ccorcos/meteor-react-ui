{div} = React.DOM
Transition = React.createFactory(React.addons.CSSTransitionGroup)
defaults = R.flip(R.merge)

ReactUI.TabVC = ReactUI.createView
  displayName: 'TabVC'
  mixins: [React.addons.PureRenderMixin, ReactUI.InstanceMixin]
  propTypes:
    instance: React.PropTypes.object.isRequired
    currentTab: React.PropTypes.string.isRequired
    renderTab: React.PropTypes.func.isRequired
    className: React.PropTypes.string
  getInitialState: ->
    instances = {}
    instances[@props.currentTab] = {}
    defaults @props.instance.state,
      tabInstances: instances
  componentWillReceiveProps: (nextProps) ->
    nextTab = nextProps.currentTab
    update = {}
    # create an instance for the new tab if it doesnt exist
    if not @state.tabInstances[nextTab]
      tabInstances = U.shallowClone(@state.tabInstances)
      tabInstances[nextTab] = {}
      update.tabInstances = tabInstances
    # if the hidden tab instance needs to be deleted
    if nextTab isnt "hidden" and @state.tabInstances.hidden
      tabInstances = update.tabInstances or U.shallowClone(@state.tabInstances)
      delete tabInstances['hidden']
      update.tabInstances = tabInstances
    # update if necessary
    if update.tabInstances
      @setState(update)
  save: ->
    state: @state
  render: ->
    div
      className: @props.className
      Transition
        transitionName: 'tabvc'
        @props.renderTab(
          @props.currentTab,
          @state.tabInstances[@props.currentTab]
        )
