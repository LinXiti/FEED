import { GAME_CONFIG } from "../config.js";
import { clamp } from "../utils/helpers.js";
import { refreshNpcDemand } from "../core/gameState.js";

export function updateNpcTimers(state, deltaTime) {
  for (const npc of state.npcs) {
    npc.countdown -= deltaTime;

    if (npc.countdown <= 0) {
      refreshNpcDemand(npc, state.stage);
      state.message = `${npc.name} 划走了广告，需求已刷新。`;
    }
  }
}

export function applyDeliverySuccess(state, npc) {
  const gain = GAME_CONFIG.progressGain[state.stage];
  npc.cocoonProgress = clamp(npc.cocoonProgress + gain, 0, GAME_CONFIG.maxProgress);
  refreshNpcDemand(npc, state.stage);
  state.message = `${npc.name} 接收成功，信息茧房 +${gain}%`;
}

export function isVictory(state) {
  return state.npcs.every((npc) => npc.cocoonProgress >= GAME_CONFIG.maxProgress);
}
