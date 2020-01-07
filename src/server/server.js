const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');

const Constants = require('../shared/constants');
const Game = require('./game');
const webpackConfig = require('../../webpack.dev.js');

// Setup an Express server
const app = express();
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
  // Setup Webpack for development
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler));
} else {
  // Static serve the dist/ folder in production
  app.use(express.static('dist'));
}

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server);

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  socket.on(Constants.MSG_TYPES.INPUT, handleInput);
  socket.on(Constants.MSG_TYPES.MOUSEPOS, handleMousePos);
  socket.on(Constants.MSG_TYPES.INPUT_MOUSE_LEFT_CLICK, handleMouseLeftClick);
  socket.on('disconnect', onDisconnect);
});

// Setup the Game
const game = new Game();

function joinGame(data) {
  game.addPlayer(this, data);
}

function handleInput(dir) {
  game.handleInput(this, dir);
}

function handleMousePos(dis) {
  game.handleMousePos(this, dis);
}

function handleMouseLeftClick(dir) {
  game.handleMouseLeftClick(this, dir);
}

function onDisconnect() {
  game.removePlayer(this);
}