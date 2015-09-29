# React UI

This package package has everything you need to build a nice Meteor app using React.

# Getting Started

    meteor add ccorcos:react-ui

## Features

### Instances

`ReactUI.instance` and `ReactUI.InstanceMixin` allow you to remember view between mounts and survive across hot code pushes.

[Check out this article](https://medium.com/p/e8b68bf398f4/).

### Proxy

`ReactUI.createProxy` let you render to different components.

[Check out this article](https://medium.com/p/bb368510aad4/).

### TabVC

`ReactUI.TabVC` manages tab based views and their instances.

[Check out this article](https://medium.com/p/48af935a5cd9/).

### NavVC

`ReactUI.NavVC` manages a navigation stack of views and their instances.

[Check out this article](https://medium.com/p/414328034e6a/).

### Others

If you set `public.ui_debounce_ms` in your settings.json, then `ReactUI.debounce` will be a global debounce to pipe you're UI actions through. This is convenient to make sure that people aren't spamming and breaking your animations.

`ReactUI.blurOnEnterTab` is a convenient handler onChange for a text field.

`ReactUI.waitForUser` is a callback on startup once the async exchange is finished and the user is either logged in or not.

`ReactUI.AutorunMixin` gives you `@autorun` and will stop them when the component unmounts.

`ReactUI.hesitate` delays before calling a function an is cancelable. This is useful when an async request may take 50ms but an animation to a loading screen would take .5s. You can introduce 100ms of delay before going to the loading screen and skipping the loading screen altogether the websocket is responsive enough.

`ReactUI.timeoutCallback` forces a callback to timeout after some time.
