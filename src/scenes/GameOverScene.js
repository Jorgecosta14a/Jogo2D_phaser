import Phaser from 'phaser';
import { getLanguage, languages, setLanguage, t } from '../i18n/index.js';
import { playSfx, resumeAudio } from '../utils/sfx.js';
import { addPanel, addTextButton, COLORS, TEXT } from '../utils/ui.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.result = {
      victory: Boolean(data.victory),
      score: data.score ?? 0,
      cores: data.cores ?? 0,
      target: data.target ?? 12
    };
  }

  create() {
    resumeAudio(this);
    this.add.image(640, 360, 'starfield').setAlpha(0.82);
    this.add.rectangle(640, 360, 1280, 720, 0x050711, 0.38);
    addPanel(this, 640, 370, 720, 360, 0.78).setDepth(2);

    const titleKey = this.result.victory ? 'victoryTitle' : 'gameOverTitle';
    const messageKey = this.result.victory ? 'victoryMessage' : 'gameOverMessage';
    const titleColor = this.result.victory ? COLORS.green : COLORS.red;

    this.title = this.add.text(640, 195, t(titleKey), {
      ...TEXT.title,
      fontSize: '48px',
      color: titleColor
    }).setOrigin(0.5).setDepth(3);

    this.message = this.add.text(640, 275, t(messageKey), TEXT.body).setOrigin(0.5).setDepth(3);
    this.scoreText = this.add.text(640, 344, t('finalScore', { score: this.result.score }), TEXT.hud).setOrigin(0.5).setDepth(3);
    this.coresText = this.add
      .text(640, 390, t('finalCores', { cores: this.result.cores, target: this.result.target }), TEXT.hud)
      .setOrigin(0.5)
      .setDepth(3);

    this.restartButton = addTextButton(this, {
      x: 530,
      y: 492,
      width: 170,
      height: 48,
      label: t('restartButton'),
      fill: '#164e63',
      stroke: COLORS.cyan,
      depth: 4,
      onClick: () => {
        playSfx(this, 'select');
        this.scene.start('GameScene');
      }
    });

    this.menuButton = addTextButton(this, {
      x: 750,
      y: 492,
      width: 170,
      height: 48,
      label: t('menuButton'),
      fill: '#1f2937',
      stroke: COLORS.amber,
      depth: 4,
      onClick: () => {
        playSfx(this, 'select');
        this.scene.start('MenuScene');
      }
    });

    this.languageButton = addTextButton(this, {
      x: 1184,
      y: 48,
      width: 90,
      height: 36,
      label: getLanguage().toUpperCase(),
      fill: '#1f2937',
      stroke: COLORS.amber,
      depth: 5,
      onClick: () => this.switchLanguage()
    });

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R).on('down', () => this.scene.start('GameScene'));
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M).on('down', () => this.scene.start('MenuScene'));
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L).on('down', () => this.switchLanguage());
  }

  switchLanguage() {
    const currentIndex = languages.findIndex((language) => language.code === getLanguage());
    const nextLanguage = languages[(currentIndex + 1) % languages.length].code;
    setLanguage(nextLanguage);
    playSfx(this, 'select');
    this.scene.restart(this.result);
  }
}
