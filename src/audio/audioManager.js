import { AUDIO_BGM, AUDIO_SFX } from "./audioConfig.js";

function createAudio(src, { volume = 1, loop = false } = {}) {
  const audio = new Audio(src);
  audio.preload = "auto";
  audio.volume = volume;
  audio.loop = loop;
  return audio;
}

class AudioManager {
  constructor() {
    this.unlocked = false;
    this.bgm = createAudio(AUDIO_BGM.src, AUDIO_BGM);
    this.sfx = Object.fromEntries(
      Object.entries(AUDIO_SFX).map(([key, config]) => [key, createAudio(config.src, config)])
    );
  }

  preloadAll() {
    this.bgm.load();
    Object.values(this.sfx).forEach((audio) => audio.load());
  }

  unlock() {
    this.unlocked = true;
  }

  startBgm() {
    if (!this.unlocked) return;
    if (!this.bgm.paused) return;
    this.bgm.currentTime = 0;
    this.bgm.play().catch(() => {});
  }

  ensureBgmPlaying() {
    if (!this.unlocked) return;
    if (!this.bgm.paused) return;
    this.bgm.play().catch(() => {});
  }

  stopBgm() {
    this.bgm.pause();
    this.bgm.currentTime = 0;
  }

  playSfx(key) {
    if (!this.unlocked) return;
    const base = this.sfx[key];
    if (!base) return;

    let audio = base;
    if (!base.paused) {
      audio = createAudio(base.src, { volume: base.volume, loop: false });
    } else {
      base.currentTime = 0;
    }

    audio.play().catch(() => {});
  }
}

export const audioManager = new AudioManager();
