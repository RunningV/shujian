require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var net = require('net');
var convert = require('buffer-encoding').convert
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var loginData;

var socketList = {};
var serverList = {};

io.on('connection', function(socket) {
  console.log('web connect')
  console.log(socket.id)
  if(!socketList[socket.id]) socketList[socket.id] = socket;
  
  if(!serverList[socket.id]) {
    serverList[socket.id] =
      new net.Socket({
        allowHalfOpen: true,
        readable: true,
        writable: true
    });
  }
  socketList[socket.id].on('login', function(data) {
    loginData = data;

    serverList[socket.id].connect(5555, '123.206.188.205', function() {
      serverList[socket.id].setKeepAlive(true, 1000);
      console.log('connect success !')
    })
  });

  socketList[socket.id].on('order', function(data) {
    console.log(data, 2)
    serverList[socket.id].write(data + '\n');
  });

  socketList[socket.id].on('logout', function() {
    serverList[socket.id].write('quit\n');
    serverList[socket.id].destroy();
  })

  serverList[socket.id].on('data', function(buffer) {
    var data = convert(buffer, 'utf8', 'gb2312').toString();
    console.log(data)
    if(data.match('Are you using BIG5 font(Y/N)?')) {
      serverList[socket.id].write('n\n');
    } else if(data.match('英文名字')) {
      console.log('输入英文ID')
      serverList[socket.id].write(loginData.id)
      serverList[socket.id].write('\n')
    } else if (data.match('识别密码')) {
      console.log('密码(passwd)')
      serverList[socket.id].write(loginData.pwd)
      serverList[socket.id].write('\n')
      socketList[socket.id].emit('success', ' mock login success')
    } else if(data.match('确定吗')) {
      console.log('确定吗(y/N)')
      serverList[socket.id].write('y\n')
    }
    else {
      socketList[socket.id].emit('message', data);
    }
  })

  serverList[socket.id].on('end', function(data) {
    console.log(data, 11)
  })

  serverList[socket.id].on('close', function(data) {
    console.log(data, 12)
  })

  serverList[socket.id].on('error', err => {
    console.log(err,33);
  })
})

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

http.listen(port, function(){
  console.log('listening on *:' + port);
});

/*var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
*/