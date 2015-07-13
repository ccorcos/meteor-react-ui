Package.describe({
  name: "ccorcos:react-tabnav",
  version: "0.0.1",
  summary: "Tab and Nav controllers for React",
  git: "https://github.com/ccorcos/meteor-react-tabnav",
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
    "src/stitch.jsx",
    "src/instance.jsx",
    "src/TabVC.jsx",
    "src/NavVC.jsx"
  ]);

  // api.export('createInstance')
  // api.export('InstanceMixin')
  // api.export('createStitch')
  // api.export('NavVC')
  // api.export('TabVC')

});
