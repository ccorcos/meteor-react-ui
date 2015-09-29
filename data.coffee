# this is meant to work with shindig:any-store
ReactUI.Data = ReactUI.createView
  displayName: 'Data'
  mixins: [React.addons.PureRenderMixin]
  propTypes:
    query: React.PropTypes.any
    store: React.PropTypes.object.isRequired
    render: React.PropTypes.func.isRequired
  getInitialState: ->
    {data, fetch, clear, watch} = @props.store.get(@props.query)
  componentWillMount: ->
    if (@state.data and not @state.data.shortcut) or not @state.fetch
      @setState({loading: false})
      @listener = @state.watch (nextState) => @setState(nextState)
    else
      @fetch()
  componentWillReceiveProps: (nextProps) ->
    if @props.store isnt nextProps.store
      throw new Meteor.Error 69, "You should never change the store prop of a \
      AnyStore.Data component. You can use a unique key prop to make sure it \
      mounts a new component if the store changes."
    unless R.equals(@props.query, nextProps.query)
      throw new Meteor.Error 69, "You should never change the query prop of a \
      AnyStore.Data component. You can use a unique key prop to make sure it \
      mounts a new component if the store changes."
  fetch: ->
    @listener?.stop()
    @setState({loading:true})
    @state.fetch (nextState) =>
      if @isMounted()
        nextState.loading = false
        @setState(nextState)
        @listener = @state.watch (nextState) =>
          @setState(nextState)
  componentWillUnmount: ->
    @listener?.stop()
    @state.clear()
  render: ->
    @props.render
      data: @state.data
      fetch: @state.fetch
      loading: @state.loading
