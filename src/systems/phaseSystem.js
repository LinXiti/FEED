import { GAME_CONFIG, MATERIAL_LIBRARY } from "../config.js";
import { refreshNpcDemand } from "../core/gameState.js";

const STAGE_FEATURE_LABELS = {
  1: "Phase 1: Ad Formats",
  2: "Phase 2: Additional Hobby Targeting",
  3: "Phase 3: Emotional Intensity Control",
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

  state.message = `Entering ${newFeature}`;
  return true;
}
