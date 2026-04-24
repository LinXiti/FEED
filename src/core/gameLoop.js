import { audioManager } from "../audio/audioManager.js";
import { GAME_CONFIG } from "../config.js";
import { syncStageState } from "../systems/phaseSystem.js";
import { updateNpcTimers, isVictory } from "../systems/npcSystem.js";

export function createGameLoop(getState, renderFrame) {
  let previousTime = performance.now();

  function frame(now) {
    const state = getState();
    const deltaTime = Math.min((now - previousTime) / 1000, 0.05);
    previousTime = now;

    if (!state.gameOver) {
      state.timeLeft = Math.max(0, state.timeLeft - deltaTime);
      const stageChanged = syncStageState(state);
      if (stageChanged) {
        audioManager.playSfx("stageUp");
      }
      updateNpcTimers(state, deltaTime);

      if (isVictory(state)) {
        state.gameOver = true;
        state.victory = true;
        state.message = "All NPC information cocoons are filled.";
      } else if (state.timeLeft <= 0) {
        state.gameOver = true;
        state.victory = false;
        state.message = "Time's up. This round of the transmission experiment has ended.";
      }
    }

    renderFrame();
    requestAnimationFrame(frame);
  }

  getState().timeLeft = GAME_CONFIG.totalTime;
  requestAnimationFrame(frame);
}
