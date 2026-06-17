import Phaser from 'phaser';
import { t } from '../i18n/index.js';
import { COLORS, TEXT } from '../utils/ui.js';

const ASSETS = [
  ['starfield', '/assets/images/starfield.svg', 1280, 720],
  ['ship', '/assets/images/ship.svg', 64, 64],
  ['meteor', '/assets/images/meteor.svg', 52, 52],
  ['drone', '/assets/images/drone.svg', 48, 48],
  ['core', '/assets/images/core.svg', 40, 40],
  ['pulse', '/assets/images/pulse.svg', 28, 28]
];

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    const barBack = this.add.rectangle(640, 400, 480, 12, 0x1f2937);
    const bar = this.add.rectangle(400, 400, 0, 12, 0x41d3ff).setOrigin(0, 0.5);
    const label = this.add.text(640, 350, t('loading'), TEXT.subtitle).setOrigin(0.5);

    this.load.on('progress', (value) => {
      bar.setSize(480 * value, 12);
    });

    this.load.on('complete', () => {
      barBack.destroy();
      bar.destroy();
      label.destroy();
    });

    ASSETS.forEach(([key, path, width, height]) => {
      this.load.svg(key, path, { width, height });
    });

    
    this.load.audio('musicaFundo', '/assets/audio/fundo-espacial.mp3');
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.panel);
    this.scene.start('MenuScene');
  }
}