// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#4-client-networking
import io from 'socket.io-client';
import { throttle } from 'throttle-debounce';
import { processGameUpdate } from './state';
import { send } from 'q';

const Constants = require('../shared/constants');

const socket = io(`ws://${window.location.host}`, { reconnection: false });
const connectedPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});

export const connect = onGameOver => (
  connectedPromise.then(() => {
    // Register callbacks
    socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
    socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
    socket.on('disconnect', () => {
      console.log('Disconnected from server.');
      document.getElementById('disconnect-modal').classList.remove('hidden');
      document.getElementById('reconnect-button').onclick = () => {
        window.location.reload();
      };
    });
  })
);

export const play = (username, shiptype) => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, {UserName: username, ShipType: shiptype});
};

export const updateDirection = throttle(20, dir => {
  socket.emit(Constants.MSG_TYPES.INPUT, dir);
});

export const updateMousePos = throttle(20, dis => {
  socket.emit(Constants.MSG_TYPES.MOUSEPOS, dis);
});

export const updateSpeedUp = throttle(20, () => {
  console.log("send message!");
  socket.emit(Constants.MSG_TYPES.INPUT_MOUSE_LEFT_CLICK);
});
