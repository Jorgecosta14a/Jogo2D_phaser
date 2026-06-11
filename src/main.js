import Phaser from 'phaser';
import './styles.css';
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

const browserScale = Math.max(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT);
const renderResolution = Math.min(
  Math.max(window.devicePixelRatio || 1, Math.ceil(browserScale)),
  2
);

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  resolution: renderResolution,
  backgroundColor: '#080b16',
  pixelArt: false,
  render: {
    antialias: true,
    antialiasGL: true,
    pixelArt: false,
    roundPixels: false,
    mipmapFilter: 'LINEAR'
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [BootScene, PreloadScene, MenuScene, GameScene, GameOverScene]
};

new Phaser.Game(config);
