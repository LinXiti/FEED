import { audioManager } from "../audio/audioManager.js";
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
        audioManager.playSfx("popupBill");
      }
      continue;
    }

    npc.countdown -= deltaTime;

    if (npc.countdown <= 0) {
      refreshNpcDemand(npc, state.stage);
      state.message = `${npc.name} The ad has been swiped away.`;
      audioManager.playSfx("popupBill");
    }
  }
}

export function applyDeliverySuccess(state, npc) {
  const gain = GAME_CONFIG.progressGain[state.stage];
  const scoreGain = GAME_CONFIG.deliveryScoreGain?.[state.stage] ?? 0;
  npc.cocoonProgress = clamp(npc.cocoonProgress + gain, 0, GAME_CONFIG.maxProgress);
  state.score = (Number(state.score) || 0) + scoreGain;
  npc.demand = {
    format: null,
    hobby: null,
    emotion: null,
  };
  npc.countdown = 0;
  npc.demandCooldown = npc.cocoonProgress >= GAME_CONFIG.maxProgress ? 0 : Math.random() * 10;
  state.message = `${npc.name} information cocoon +${gain}%, computing power points +${scoreGain}`;

  if (npc.cocoonProgress >= GAME_CONFIG.maxProgress) {
    audioManager.playSfx("npcComplete");
  }
}

export function isVictory(state) {
  return state.npcs.every((npc) => npc.cocoonProgress >= GAME_CONFIG.maxProgress);
}
