import Phaser from 'phaser';
import { getLanguage, languages, setLanguage, t, toggleLanguage } from '../i18n/index.js';
import { playSfx, resumeAudio } from '../utils/sfx.js';
import { addTextButton, COLORS, TEXT } from '../utils/ui.js';

const WORLD = {
  width: 1280,
  height: 720,
  targetCores: 12,
  startLives: 3
};

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init() {
    this.score = 0;
    this.cores = 0;
    this.lives = WORLD.startLives;
    this.isFinished = false;
    this.isInvulnerable = false;
    this.lastDirection = new Phaser.Math.Vector2(0, -1);
    this.nextPulseAt = 0;
  }

  create() {
    resumeAudio(this);
    this.add.image(640, 360, 'starfield').setAlpha(0.96);
    this.add.rectangle(640, 360, 1280, 720, 0x050711, 0.16);
    this.createDust();

    this.player = this.physics.add.image(640, 560, 'ship');
    this.player.setCircle(22, 10, 10);
    this.player.setCollideWorldBounds(true);
    this.player.setMaxVelocity(280);

    this.coresGroup = this.physics.add.group();
    this.meteors = this.physics.add.group();
    this.drones = this.physics.add.group();
    this.pulses = this.physics.add.group({ maxSize: 6 });

    this.spawnCore(6);
    this.spawnMeteor(5);
    this.spawnDrone();

    this.physics.add.overlap(this.player, this.coresGroup, this.collectCore, null, this);
    this.physics.add.overlap(this.player, this.meteors, this.takeDamage, null, this);
    this.physics.add.overlap(this.player, this.drones, this.takeDamage, null, this);
    this.physics.add.overlap(this.pulses, this.meteors, this.destroyEnemy, null, this);
    this.physics.add.overlap(this.pulses, this.drones, this.destroyEnemy, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      pulse: Phaser.Input.Keyboard.KeyCodes.SPACE,
      lang: Phaser.Input.Keyboard.KeyCodes.L
    });

    this.keys.pulse.on('down', () => this.firePulse());
    this.keys.lang.on('down', () => {
      toggleLanguage();
      this.refreshTexts();
    });

    this.input.on('pointerdown', (pointer) => {
      this.firePulse(pointer);
    });

    this.enemyTimer = this.time.addEvent({
      delay: 2300,
      loop: true,
      callback: () => this.spawnPressure()
    });

    this.createHud();
  }

  update(time) {
    if (this.isFinished) {
      return;
    }

    this.movePlayer();
    this.updateDrones();
    this.recycleFarPulses();
    this.updatePulseHud(time);
  }

  createDust() {
    const graphics = this.add.graphics();
    const colors = [0x41d3ff, 0xffc75f, 0xf7fbff, 0x78e08f];

    for (let index = 0; index < 90; index += 1) {
      const color = colors[index % colors.length];
      graphics.fillStyle(color, index % 3 === 0 ? 0.5 : 0.28);
      graphics.fillCircle(
        Phaser.Math.Between(12, WORLD.width - 12),
        Phaser.Math.Between(52, WORLD.height - 12),
        Phaser.Math.FloatBetween(0.8, 2.2)
      );
    }
  }

  createHud() {
    this.hudBackground = this.add.rectangle(640, 32, 1240, 48, 0x111827, 0.72).setDepth(30);
    this.hudBackground.setStrokeStyle(1, 0x243041);

    this.scoreText = this.add.text(36, 20, '', TEXT.hud).setDepth(31);
    this.livesText = this.add.text(316, 20, '', TEXT.hud).setDepth(31);
    this.coresText = this.add.text(520, 20, '', TEXT.hud).setDepth(31);
    this.pulseText = this.add.text(846, 20, '', TEXT.hud).setDepth(31);

    this.languageButton = addTextButton(this, {
      x: 1184,
      y: 32,
      width: 90,
      height: 36,
      label: getLanguage().toUpperCase(),
      fill: '#1f2937',
      stroke: COLORS.amber,
      depth: 32,
      onClick: () => {
        const currentIndex = languages.findIndex((language) => language.code === getLanguage());
        const nextLanguage = languages[(currentIndex + 1) % languages.length].code;
        setLanguage(nextLanguage);
        playSfx(this, 'select');
        this.refreshTexts();
      }
    });

    this.refreshTexts();
  }

  refreshTexts() {
    const pulseState =
      this.time.now >= this.nextPulseAt
        ? t('pulseReady')
        : t('pulseCharging', {
            percent: Phaser.Math.Clamp(
              Math.round(100 - ((this.nextPulseAt - this.time.now) / this.getPulseCooldown()) * 100),
              0,
              99
            )
          });

    this.scoreText.setText(t('scoreValue', { score: this.score }));
    this.livesText.setText(t('livesValue', { lives: this.lives }));
    this.coresText.setText(t('coresValue', { cores: this.cores, target: WORLD.targetCores }));
    this.pulseText.setText(t('pulseValue', { state: pulseState }));
    this.languageButton.setLabel(getLanguage().toUpperCase());
  }

  updatePulseHud(time) {
    if (!this.pulseText || this.lastPulseHudUpdate === Math.floor(time / 100)) {
      return;
    }

    this.lastPulseHudUpdate = Math.floor(time / 100);
    this.refreshTexts();
  }

  movePlayer() {
    const input = new Phaser.Math.Vector2(0, 0);

    if (this.cursors.left.isDown || this.keys.left.isDown) input.x -= 1;
    if (this.cursors.right.isDown || this.keys.right.isDown) input.x += 1;
    if (this.cursors.up.isDown || this.keys.up.isDown) input.y -= 1;
    if (this.cursors.down.isDown || this.keys.down.isDown) input.y += 1;

    if (input.lengthSq() > 0) {
      input.normalize();
      this.lastDirection.copy(input);
      this.player.setVelocity(input.x * 250, input.y * 250);
      this.player.rotation = input.angle() + Math.PI / 2;
    } else {
      this.player.setVelocity(0, 0);
    }
  }

  spawnCore(amount = 1) {
    for (let index = 0; index < amount; index += 1) {
      const position = this.safePosition(68);
      const core = this.coresGroup.create(position.x, position.y, 'core');
      core.setCircle(16, 4, 4);
      core.setImmovable(true);
      core.setData('floatOffset', Phaser.Math.FloatBetween(0, Math.PI * 2));
      this.tweens.add({
        targets: core,
        scale: 1.12,
        yoyo: true,
        repeat: -1,
        duration: 820,
        ease: 'Sine.easeInOut',
        delay: index * 80
      });
    }
  }

  spawnMeteor(amount = 1) {
    for (let index = 0; index < amount; index += 1) {
      const edge = Phaser.Math.Between(0, 3);
      const x = edge < 2 ? Phaser.Math.Between(48, WORLD.width - 48) : edge === 2 ? 24 : WORLD.width - 24;
      const y = edge < 2 ? (edge === 0 ? 84 : WORLD.height - 24) : Phaser.Math.Between(84, WORLD.height - 24);
      const meteor = this.meteors.create(x, y, 'meteor');
      const speed = Phaser.Math.Between(92, 138) + this.cores * 4;
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);

      meteor.setCircle(23, 3, 3);
      meteor.setBounce(1);
      meteor.setCollideWorldBounds(true);
      meteor.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
      meteor.setAngularVelocity(Phaser.Math.Between(-70, 70));
    }
  }

  spawnDrone() {
    const position = this.safePosition(130);
    const drone = this.drones.create(position.x, position.y, 'drone');
    drone.setCircle(19, 5, 5);
    drone.setCollideWorldBounds(true);
    drone.setData('speed', 92 + this.cores * 3);
  }

  spawnPressure() {
    if (this.isFinished) {
      return;
    }

    if (this.meteors.countActive(true) < 6 + Math.floor(this.cores / 2)) {
      this.spawnMeteor();
    }

    if (this.cores >= 4 && this.drones.countActive(true) < 2 + Math.floor(this.cores / 5)) {
      this.spawnDrone();
    }
  }

  safePosition(minDistance) {
    let point = new Phaser.Math.Vector2(WORLD.width / 2, WORLD.height / 2);

    for (let attempts = 0; attempts < 40; attempts += 1) {
      point = new Phaser.Math.Vector2(
        Phaser.Math.Between(48, WORLD.width - 48),
        Phaser.Math.Between(72, WORLD.height - 48)
      );

      if (!this.player || Phaser.Math.Distance.Between(point.x, point.y, this.player.x, this.player.y) > minDistance) {
        break;
      }
    }

    return point;
  }

  collectCore(player, core) {
    core.disableBody(true, true);
    this.score += 100;
    this.cores += 1;
    playSfx(this, 'collect');

    this.burst(core.x, core.y, COLORS.green);
    this.cameras.main.shake(80, 0.004);
    this.spawnCore();
    this.refreshTexts();

    if (this.cores >= WORLD.targetCores) {
      this.finish(true);
    }
  }

  takeDamage(player, enemy) {
    if (this.isInvulnerable || this.isFinished) {
      return;
    }

    this.lives -= 1;
    this.isInvulnerable = true;
    playSfx(this, 'hit');
    this.cameras.main.shake(160, 0.01);
    this.burst(player.x, player.y, COLORS.red);

    const angle = Phaser.Math.Angle.Between(player.x, player.y, enemy.x, enemy.y);
    enemy.setVelocity(Math.cos(angle) * 190, Math.sin(angle) * 190);

    this.tweens.add({
      targets: player,
      alpha: 0.35,
      yoyo: true,
      repeat: 5,
      duration: 90,
      onComplete: () => {
        player.setAlpha(1);
        this.isInvulnerable = false;
      }
    });

    this.refreshTexts();

    if (this.lives <= 0) {
      this.finish(false);
    }
  }

  firePulse(pointer = null) {
    const now = this.time.now;

    if (this.isFinished || now < this.nextPulseAt) {
      return;
    }

    let direction = this.lastDirection.clone();
    if (pointer) {
      direction = new Phaser.Math.Vector2(pointer.worldX - this.player.x, pointer.worldY - this.player.y);
      if (direction.lengthSq() === 0) {
        direction = this.lastDirection.clone();
      }
      direction.normalize();
      this.lastDirection.copy(direction);
      this.player.rotation = direction.angle() + Math.PI / 2;
    }

    const pulse = this.pulses.get(this.player.x + direction.x * 32, this.player.y + direction.y * 32, 'pulse');
    if (!pulse) {
      return;
    }

    pulse.setActive(true).setVisible(true);
    pulse.enableBody(true, pulse.x, pulse.y, true, true);
    pulse.setCircle(11, 3, 3);
    pulse.rotation = direction.angle();
    pulse.setVelocity(direction.x * 470, direction.y * 470);
    pulse.setData('bornAt', now);

    playSfx(this, 'pulse');
    this.nextPulseAt = now + this.getPulseCooldown();
    this.refreshTexts();
  }

  destroyEnemy(pulse, enemy) {
    pulse.disableBody(true, true);
    enemy.disableBody(true, true);
    this.score += enemy.texture.key === 'drone' ? 80 : 50;
    this.burst(enemy.x, enemy.y, COLORS.amber);
    this.refreshTexts();
  }

  recycleFarPulses() {
    this.pulses.children.iterate((pulse) => {
      if (!pulse?.active) {
        return;
      }

      const expired = this.time.now - pulse.getData('bornAt') > 760;
      const outside = pulse.x < -30 || pulse.x > WORLD.width + 30 || pulse.y < -30 || pulse.y > WORLD.height + 30;

      if (expired || outside) {
        pulse.disableBody(true, true);
      }
    });
  }

  updateDrones() {
    this.drones.children.iterate((drone) => {
      if (!drone?.active) {
        return;
      }

      const speed = drone.getData('speed') + this.cores * 2;
      const angle = Phaser.Math.Angle.Between(drone.x, drone.y, this.player.x, this.player.y);
      drone.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
      drone.rotation = angle + Math.PI / 2;
    });
  }

  getPulseCooldown() {
    return Math.max(520, 920 - this.cores * 18);
  }

  burst(x, y, color) {
    const particles = this.add.particles(x, y, 'pulse', {
      speed: { min: 40, max: 140 },
      lifespan: 360,
      quantity: 10,
      scale: { start: 0.55, end: 0 },
      tint: Phaser.Display.Color.HexStringToColor(color).color,
      blendMode: 'ADD'
    });

    this.time.delayedCall(380, () => particles.destroy());
  }

  finish(victory) {
    this.isFinished = true;
    this.player.setVelocity(0, 0);
    this.enemyTimer?.remove();
    playSfx(this, victory ? 'win' : 'lose');

    this.time.delayedCall(520, () => {
      this.scene.start('GameOverScene', {
        victory,
        score: this.score,
        cores: this.cores,
        target: WORLD.targetCores
      });
    });
  }
}
