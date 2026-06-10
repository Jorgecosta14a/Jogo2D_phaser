const EVENTS = {
  collect: {
    notes: [740, 980],
    duration: 0.12,
    wave: 'triangle',
    gain: 0.12
  },
  hit: {
    notes: [180, 120],
    duration: 0.2,
    wave: 'sawtooth',
    gain: 0.1
  },
  pulse: {
    notes: [420, 260],
    duration: 0.1,
    wave: 'square',
    gain: 0.07
  },
  win: {
    notes: [520, 660, 880],
    duration: 0.16,
    wave: 'triangle',
    gain: 0.11
  },
  lose: {
    notes: [260, 210, 150],
    duration: 0.18,
    wave: 'sine',
    gain: 0.1
  },
  select: {
    notes: [500],
    duration: 0.08,
    wave: 'triangle',
    gain: 0.08
  }
};

export function resumeAudio(scene) {
  const context = scene.sound?.context;

  if (context?.state === 'suspended') {
    context.resume();
  }
}

export function playSfx(scene, name) {
  const event = EVENTS[name];
  const context = scene.sound?.context;

  if (!event || !context || scene.sound.locked) {
    return;
  }

  const now = context.currentTime;
  event.notes.forEach((frequency, index) => {
    const start = now + index * event.duration * 0.72;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = event.wave;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(event.gain, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + event.duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + event.duration + 0.03);
  });
}
