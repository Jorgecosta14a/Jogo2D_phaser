import Phaser from 'phaser';

export const COLORS = {
  ink: '#f7fbff',
  muted: '#aeb8c7',
  panel: '#111827',
  cyan: '#41d3ff',
  amber: '#ffc75f',
  green: '#78e08f',
  red: '#ff6b6b',
  violet: '#b392ff'
};

export const TEXT = {
  title: {
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontSize: '58px',
    fontStyle: 'bold',
    color: COLORS.ink
  },
  subtitle: {
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontSize: '20px',
    color: COLORS.muted
  },
  hud: {
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontSize: '18px',
    fontStyle: 'bold',
    color: COLORS.ink
  },
  body: {
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontSize: '22px',
    color: COLORS.ink,
    align: 'center'
  },
  button: {
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontSize: '19px',
    fontStyle: 'bold',
    color: COLORS.ink
  }
};

export function addTextButton(scene, options) {
  const {
    x,
    y,
    width = 190,
    height = 48,
    label,
    onClick,
    fill = '#1e293b',
    stroke = COLORS.cyan,
    active = false
  } = options;

  const group = scene.add.container(x, y).setDepth(options.depth ?? 20);
  const background = scene.add.rectangle(0, 0, width, height, fill, active ? 0.98 : 0.88);
  const caption = scene.add.text(0, 0, label, TEXT.button).setOrigin(0.5);

  background.setStrokeStyle(active ? 3 : 2, Phaser.Display.Color.HexStringToColor(stroke).color);
  background.setInteractive({ useHandCursor: true });
  group.add([background, caption]);

  background.on('pointerover', () => {
    background.setFillStyle(stroke, 0.32);
    scene.tweens.add({ targets: group, scale: 1.03, duration: 120 });
  });

  background.on('pointerout', () => {
    background.setFillStyle(fill, active ? 0.98 : 0.88);
    scene.tweens.add({ targets: group, scale: 1, duration: 120 });
  });

  background.on('pointerdown', (pointer, localX, localY, event) => {
    event?.stopPropagation();
    onClick?.();
  });

  group.setLabel = (nextLabel) => caption.setText(nextLabel);
  group.setActiveState = (isActive) => {
    background.setAlpha(isActive ? 0.98 : 0.88);
    background.setStrokeStyle(isActive ? 3 : 2, Phaser.Display.Color.HexStringToColor(stroke).color);
  };

  return group;
}

export function addPanel(scene, x, y, width, height, alpha = 0.68) {
  return scene.add
    .rectangle(x, y, width, height, COLORS.panel, alpha)
    .setStrokeStyle(1, Phaser.Display.Color.HexStringToColor('#243041').color);
}
