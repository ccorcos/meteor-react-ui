Package.describe({
  name: "ccorcos:react-ui",
  version: "0.0.1",
  summary: "React View Controllers for Meteor",
  git: "https://github.com/ccorcos/meteor-react-ui",
});


Package.onUse(function(api) {

  api.use([
    "react-runtime",
    "jsx"
  ]);

  api.imply([
    "react-runtime",
  ]);

  api.addFiles([
    "src/utils.jsx",
    "src/Dispatcher.jsx",
    "src/InstanceMixin.jsx",
    "src/TabVC.jsx",
    "src/NavVC.jsx"
  ], 'client');
});
