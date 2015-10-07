Package.describe({
  name: "ccorcos:react-ui",
  version: "0.1.0",
  summary: "React Instance, Proxy, Data, and View Controllers",
  git: "https://github.com/ccorcos/meteor-react-ui",
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');
  var packages = [
    'coffeescript',
    'ccorcos:utils@0.0.2',
    'random',
    'react-runtime@0.13.3'
  ]
  api.use(packages);
  api.imply(packages);
  api.addFiles([
    'globals.js',
    'init.coffee',
    'data.coffee',
    'proxy.coffee',
    'instance.coffee',
    'tabvc.coffee',
    'navvc.coffee'
  ], 'client');
  api.export(['ReactUI'], 'client');
});
