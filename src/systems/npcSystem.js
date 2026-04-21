import { GAME_CONFIG } from "../config.js";
import { clamp } from "../utils/helpers.js";
import { refreshNpcDemand } from "../core/gameState.js";

export function updateNpcTimers(state, deltaTime) {
  for (const npc of state.npcs) {
    if (npc.cocoonProgress >= GAME_CONFIG.maxProgress) {
      npc.demand = {
        format: null,
        hobby: null,
        emotion: null,
      };
      npc.countdown = 0;
      npc.demandCooldown = 0;
      continue;
    }

    if (npc.demandCooldown > 0) {
      npc.demandCooldown = Math.max(0, npc.demandCooldown - deltaTime);
      if (npc.demandCooldown === 0) {
        refreshNpcDemand(npc, state.stage);
      }
      continue;
    }

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
  npc.demand = {
    format: null,
    hobby: null,
    emotion: null,
  };
  npc.countdown = 0;
  npc.demandCooldown = npc.cocoonProgress >= GAME_CONFIG.maxProgress ? 0 : Math.random() * 10;
  state.message = `${npc.name} 接收成功，信息茧房 +${gain}%`;
}

export function isVictory(state) {
  return state.npcs.every((npc) => npc.cocoonProgress >= GAME_CONFIG.maxProgress);
}
