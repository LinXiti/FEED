import { GAME_CONFIG, MATERIAL_LIBRARY } from "../config.js";
import { refreshNpcDemand } from "../core/gameState.js";

const STAGE_FEATURE_LABELS = {
  1: "第一阶段：投放形式",
  2: "第二阶段：追加爱好定向",
  3: "第三阶段：操控情感烈度",
};

export function getStageByTime(timeLeft) {
  if (timeLeft > GAME_CONFIG.totalTime - GAME_CONFIG.phaseDurations.phase1) {
    return 1;
  }

  if (timeLeft > GAME_CONFIG.phaseDurations.phase3) {
    return 2;
  }

  return 3;
}

export function syncStageState(state) {
  const nextStage = getStageByTime(state.timeLeft);

  if (nextStage === state.stage) {
    return false;
  }

  state.stage = nextStage;
  state.npcs.forEach((npc) => refreshNpcDemand(npc, nextStage));

  if (nextStage >= 2) {
    state.availableMaterials.hobbies = [...MATERIAL_LIBRARY.hobbies];
  }

  if (nextStage >= 3) {
    state.availableMaterials.emotions = [...MATERIAL_LIBRARY.emotions];
  }

  const newFeature = STAGE_FEATURE_LABELS[nextStage];
  state.unlockedFeatures.push(newFeature);
  state.phaseBanner = state.unlockedFeatures.join("\n");

  state.message = `进入${newFeature}`;
  return true;
}
