// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#3-client-entrypoints
import { connect, play } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { downloadAssets, readJSOn } from './assets';
import { initState } from './state';
import { setLeaderboardHidden } from './leaderboard';

// I'm using Bootstrap here for convenience, but I wouldn't recommend actually doing this for a real
// site. It's heavy and will slow down your site - either only use a subset of Bootstrap, or just
// write your own CSS.
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/main.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');
const shiptype = document.getElementById('shiptype').getElementsByClassName('active');

Promise.all([
  connect(onGameOver),
  downloadAssets(),
  readJSOn('spritesheet.json'),
  readJSOn('spritesheetspark.json'),
  readJSOn('spritesheetexplosion.json'),
  readJSOn('spritesheet_star_blue.json'),
  readJSOn('spritesheet_planet_01.json'),
  readJSOn('spritesheet_star_ograne.json'),
  readJSOn('spritesheet_star_red.json'),
  readJSOn('spritesheet_star_yellow.json'),
  readJSOn('spritesheet_star_white.json'),
  readJSOn('spritesheet_bomb_1_explosion.json'),
  readJSOn('spritesheet_bomb_1_idle.json'),
]).then(() => {
  playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // Play!
    play(usernameInput.value,shiptype[0].getAttribute('value'));
    playMenu.classList.add('hidden');
    initState();
    startCapturingInput();
    startRendering();
    setLeaderboardHidden(false);
  };
}).catch(console.error);

function onGameOver() {
  stopCapturingInput();
  stopRendering();
  playMenu.classList.remove('hidden');
  setLeaderboardHidden(true);
}

