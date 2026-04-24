import { audioManager } from "../audio/audioManager.js";
import { GAME_CONFIG } from "../config.js";
import { applyDeliverySuccess } from "./npcSystem.js";

export function isAdMatchingStage(ad, npc, stage) {
  if (!ad || !npc) return false;
  if (ad.format !== npc.demand.format) return false;
  if (stage >= 2 && ad.hobby !== npc.demand.hobby) return false;
  if (stage >= 3 && ad.emotion !== npc.demand.emotion) return false;
  return true;
}

export function deliverAdToNpc(state, adId, npcId) {
  const adIndex = state.pendingAds.findIndex((item) => item.id === adId);
  const npc = state.npcs.find((item) => item.id === npcId);

  if (adIndex === -1 || !npc) {
    state.message = "The targeting is invalid.";
    audioManager.playSfx("matchFail");
    return false;
  }

  if (npc.cocoonProgress >= GAME_CONFIG.maxProgress) {
    state.message = `${npc.name} has been completed, no need to continue feeding.`;
    audioManager.playSfx("matchFail");
    return false;
  }

  const ad = state.pendingAds[adIndex];

  if (!isAdMatchingStage(ad, npc, state.stage)) {
    state.message = "The ad does not match the NPC's demand. ";
    audioManager.playSfx("matchFail");
    return false;
  }

  state.pendingAds.splice(adIndex, 1);
  applyDeliverySuccess(state, npc);
  audioManager.playSfx("matchSuccess");
  return true;
}
