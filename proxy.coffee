
defer = (f) ->
  (arg) ->
      Meteor.setTimeout ->
        f(arg)
      , 0

Transition = React.createFactory(React.addons.CSSTransitionGroup)

ReactUI.createProxy = (transform=R.identity) ->
  Proxy = ReactUI.createView
    displayName: 'Proxy'
    mixins: [React.addons.PureRenderMixin]
    propTypes:
      renderProxy: React.PropTypes.func
      transitionName: React.PropTypes.string
      transitionAppear: React.PropTypes.bool
      transitionEnter: React.PropTypes.bool
      transitionLeave: React.PropTypes.bool
    getInitialState: ->
      value: undefined
    componentWillMount: ->
      @listener = listen (value) =>
        @setState({value})
    componentWillUnMount: ->
      @listener.stop()
    render: ->
      @props.renderProxy?(@state.value)
      if @props.transitionName
        Transition
          transitionName: @props.transitionName
          transitionAppear: @props.transitionAppear
          transitionEnter: @props.transitionEnter
          transitionLeave: @props.transitionLeave
          do =>
            if @state.value is undefined
              React.DOM.span()
            else
              Proxy.transform(@state.value) or React.DOM.span()
      else
        do =>
          if @state.value is undefined
            false
          else
            console.log "render proxy", @state.value
            Proxy.transform(@state.value) or false

  Proxy.value = undefined
  listeners = {}
  listen = (f) ->
    id = Random.hexString(10)
    listeners[id] = f
    f(Proxy.value)
    {stop: -> delete listeners[id]}
  dispatch = (x) ->
    Proxy.value = x
    for id, f of listeners
      f(x)

  Proxy.transform = transform
  Proxy.render = defer dispatch
  Proxy.setTransform = (f) ->
    Proxy.transform = f
  return Proxy
