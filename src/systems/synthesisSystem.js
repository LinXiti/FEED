import { audioManager } from "../audio/audioManager.js";

const REQUIRED_TYPES = {
  1: ["format"],
  2: ["format", "hobby"],
  3: ["format", "hobby", "emotion"],
};

export function canSynthesize(state) {
  return REQUIRED_TYPES[state.stage].every((type) => Boolean(state.synthesisSlots[type]));
}

export function synthesizeAd(state) {
  if (!canSynthesize(state)) {
    state.message = "Missing required assets, cannot synthesize ad.";
    audioManager.playSfx("matchFail");
    return null;
  }

  const ad = {
    id: crypto.randomUUID(),
    formatId: state.synthesisSlots.format?.id ?? null,
    format: state.synthesisSlots.format?.label ?? null,
    hobbyId: state.synthesisSlots.hobby?.id ?? null,
    hobby: state.synthesisSlots.hobby?.label ?? null,
    emotionId: state.synthesisSlots.emotion?.id ?? null,
    emotion: state.synthesisSlots.emotion?.label ?? null,
  };

  state.pendingAds.push(ad);
  state.synthesisSlots = {
    format: null,
    hobby: null,
    emotion: null,
  };
  state.message = "Ad synthesized successfully.";
  return ad;
}
