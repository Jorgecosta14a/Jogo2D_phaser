import Phaser from 'phaser';
import { getLanguage, languages, setLanguage, t } from '../i18n/index.js';
import { playSfx, resumeAudio } from '../utils/sfx.js';
import { addTextButton, COLORS, TEXT } from '../utils/ui.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.add.image(640, 360, 'starfield').setAlpha(0.92);
    this.add.rectangle(640, 360, 1280, 720, 0x050711, 0.18);

    this.add.text(640, 176, t('gameTitle'), TEXT.title).setOrigin(0.5);
    this.add.text(640, 250, t('tagline'), TEXT.subtitle).setOrigin(0.5);

    addTextButton(this, {
      x: 640,
      y: 370,
      width: 260,
      height: 58,
      label: t('startMission'),
      fill: '#164e63',
      stroke: COLORS.cyan,
      onClick: () => {
        resumeAudio(this);
        playSfx(this, 'select');
        this.scene.start('GameScene');
      }
    });

    this.add.text(640, 482, t('language'), TEXT.hud).setOrigin(0.5);

    languages.forEach((language, index) => {
      addTextButton(this, {
        x: 540 + index * 200,
        y: 552,
        width: 140,
        height: 46,
        label: language.label,
        fill: '#1f2937',
        stroke: language.code === 'pt' ? COLORS.green : COLORS.amber,
        active: getLanguage() === language.code,
        onClick: () => {
          setLanguage(language.code);
          playSfx(this, 'select');
          this.scene.restart();
        }
      });
    });
  }
}
