{div} = React.DOM
Transition = React.createFactory(React.addons.CSSTransitionGroup)
defaults = R.flip(R.merge)

ReactUI.NavVC = ReactUI.createView
  displayName: 'NavVC'
  mixins: [React.addons.PureRenderMixin, ReactUI.InstanceMixin]
  propTypes:
    instance: React.PropTypes.object.isRequired
    rootScene: React.PropTypes.object.isRequired
    renderScene: React.PropTypes.func.isRequired
    pushProxy: React.PropTypes.func
    popProxy: React.PropTypes.func
    className: React.PropTypes.string
  getInitialState: ->
    defaults @props.instance.state,
      transition: 'navvc-appear'
      stack: [{
        sceneRoute: @props.rootScene
        instance: {}
      }]
  push: (route) ->
    nextStack = React.addons.update @state.stack,
      $push:[{
        sceneRoute: route
        instance: {}
      }]
    @setState
      stack: nextStack
      transition: 'navvc-push'
  pop: ->
    if @state.stack.length is 1
      console.warn("You shouldn't pop off the root view of a NavVC!")
    else
      last = @state.stack.length - 1
      nextStack = React.addons.update @state.stack,
        $splice:[[last, 1]]
      @setState
        stack: nextStack
        transition: 'navvc-pop'
  popFront: ->
    @setState
      stack: [@state.stack[0]]
      transition: 'navvc-pop'
  save: ->
    state: @state
  render: ->
    {sceneRoute, instance} = @state.stack[@state.stack.length - 1]
    pop = @pop if @state.stack.length > 1
    popFront = @popFront if @state.stack.length > 1
    @props.pushProxy?.render(@push)
    @props.popProxy?.render({pop, popFront})
    div
      className: @props.className
      Transition
        transitionName: @state.transition
        @props.renderScene(sceneRoute, instance, @push, pop, popFront)
