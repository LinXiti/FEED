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
      syncStageState(state);
      updateNpcTimers(state, deltaTime);

      if (isVictory(state)) {
        state.gameOver = true;
        state.victory = true;
        state.message = "所有 NPC 的信息茧房都已填满。";
      } else if (state.timeLeft <= 0) {
        state.gameOver = true;
        state.victory = false;
        state.message = "时间结束，本轮传播实验终止。";
      }
    }

    renderFrame();
    requestAnimationFrame(frame);
  }

  getState().timeLeft = GAME_CONFIG.totalTime;
  requestAnimationFrame(frame);
}
