require('babel-register');

var fs = require('fs');
var express = require('express');
var chokidar = require('chokidar');
var webpack = require('webpack');
var config = require('./webpack.config');
var compiler = webpack(config);
var middleware = require('webpack-dev-middleware');

/* eslint-disable no-sync */
var template = fs.readFileSync(__dirname + '/index.html', 'utf8');
/* eslint-enable no-sync */

require('css-modules-require-hook')({
  generateScopedName: '[path][name]-[local]',
});

var app = express();

// Serve hot-reloading bundle to client
app.use(middleware(compiler, {
  noInfo: true, publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
  res.send(template);
});

// Do 'hot-reloading' of express stuff on the server
// Throw away cached modules and re-require next time
// Ensure there's no important state in there!
var watcher = chokidar.watch('./server');

watcher.on('ready', function() {
  watcher.on('all', function() {
    console.log('Clearing /server/ module cache from server');
    Object.keys(require.cache).forEach(function(id) {
      if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id];
    });
  });
});

// Do 'hot-reloading' of react stuff on the server
// Throw away the cached client modules and let them be re-required next time
compiler.plugin('done', function() {
  console.log('Clearing /client/ module cache from server');
  Object.keys(require.cache).forEach(function(id) {
    if (/[\/\\]client[\/\\]/.test(id)) delete require.cache[id];
  });
});

var http = require('http');
var server = http.createServer(app);
server.listen(3000, 'localhost', function(err) {
  if (err) throw err;

  var addr = server.address();

  console.log('Listening at http://%s:%d', addr.address, addr.port);
});
