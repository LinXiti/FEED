export const AUDIO_BGM = {
  src: new URL("../../assets/audio/bgm2.wav", import.meta.url).href,
  volume: 0.45,
  loop: true,
};

export const AUDIO_SFX = {
  grab: {
    src: new URL("../../assets/audio/sfx_grab.wav", import.meta.url).href,
    volume: 0.65,
  },
  slotIn: {
    src: new URL("../../assets/audio/sfx_slot_in.wav", import.meta.url).href,
    volume: 0.7,
  },
  clear: {
    src: new URL("../../assets/audio/sfx_clear.wav", import.meta.url).href,
    volume: 0.7,
  },
  matchSuccess: {
    src: new URL("../../assets/audio/sfx_match_success.wav", import.meta.url).href,
    volume: 0.72,
  },
  matchFail: {
    src: new URL("../../assets/audio/sfx_match_fail.wav", import.meta.url).href,
    volume: 0.72,
  },
  npcComplete: {
    src: new URL("../../assets/audio/sfx_npc_complete.wav", import.meta.url).href,
    volume: 0.8,
  },
  stageUp: {
    src: new URL("../../assets/audio/sfx_stage_up.wav", import.meta.url).href,
    volume: 0.75,
  },
  popupBill: {
    src: new URL("../../assets/audio/sfx_popup_bill.wav", import.meta.url).href,
    volume: 0.6,
  },
};

