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
    state.message = "投放目标无效。";
    return false;
  }

  if (npc.cocoonProgress >= GAME_CONFIG.maxProgress) {
    state.message = `${npc.name} 已完成，无需继续投喂。`;
    return false;
  }

  const ad = state.pendingAds[adIndex];

  if (!isAdMatchingStage(ad, npc, state.stage)) {
    state.message = "广告不匹配，该广告已退回待投放区。";
    return false;
  }

  state.pendingAds.splice(adIndex, 1);
  applyDeliverySuccess(state, npc);
  return true;
}
