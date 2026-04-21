import { GAME_CONFIG } from "./config.js";
import { createInitialGameState } from "./core/gameState.js";
import { createGameLoop } from "./core/gameLoop.js";
import { buildLayout } from "./render/layout.js";
import { renderGame } from "./render/canvasRenderer.js";
import { createDragSystem } from "./systems/dragSystem.js";
import { synthesizeAd } from "./systems/synthesisSystem.js";
import { deliverAdToNpc } from "./systems/deliverySystem.js";
import { formatSeconds } from "./utils/helpers.js";

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const stageLabel = document.getElementById("stage-label");
const timerLabel = document.getElementById("timer-label");
const messageBox = document.getElementById("message-box");
const startScreen = document.getElementById("start-screen");
const endScreen = document.getElementById("end-screen");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const endTitle = document.getElementById("end-title");
const endMessage = document.getElementById("end-message");
const endIcon = document.getElementById("end-icon");

canvas.width = GAME_CONFIG.width;
canvas.height = GAME_CONFIG.height;

let state = createInitialGameState();
let layout = buildLayout(GAME_CONFIG, state);
let dragSystem = null;
let loopStarted = false;
let endShown = false;

function updateHud() {
  stageLabel.textContent = `阶段 ${state.stage}`;
  timerLabel.textContent = formatSeconds(state.timeLeft);
  messageBox.textContent = state.message;
}

function assignMaterialToSlot(material, slotType) {
  if (material.type !== slotType) {
    state.message = `该素材不能放入 ${slotType} 槽位。`;
    return;
  }
  if (slotType === "hobby" && state.stage < 2) {
    state.message = "第二阶段才会解锁爱好槽位。";
    return;
  }
  if (slotType === "emotion" && state.stage < 3) {
    state.message = "第三阶段才会解锁情感槽位。";
    return;
  }
  state.synthesisSlots[slotType] = material;
  state.message = `${material.label} 已放入 ${slotType} 槽位。`;
}

function showEndScreen(victory) {
  if (victory) {
    endIcon.textContent = "🎯";
    endTitle.textContent = "实验成功";
    endMessage.textContent = "所有用户的信息茧房已填满，目标受众完全被算法包围。";
  } else {
    endIcon.textContent = "⏱️";
    endTitle.textContent = "实验失败";
    endMessage.textContent = "时间耗尽，仍有用户未被完全覆盖。信息茧房尚未成型。";
  }
  endScreen.classList.remove("hidden");
}

function startGame() {
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  endShown = false;

  state = createInitialGameState();
  layout = buildLayout(GAME_CONFIG, state);

  if (dragSystem) dragSystem.destroy();
  dragSystem = createDragSystem({
    canvas,
    state,
    layout,
    onMaterialDropped: assignMaterialToSlot,
    onAdDropped: (adId, npcId) => deliverAdToNpc(state, adId, npcId),
    onAdRemoved: (adId) => {
      const adIndex = state.pendingAds.findIndex((ad) => ad.id === adId);
      if (adIndex === -1) return;
      state.pendingAds.splice(adIndex, 1);
      state.message = "广告已删除。";
    },
  });

  if (!loopStarted) {
    loopStarted = true;
    createGameLoop(
      () => state,
      () => {
        const nextLayout = buildLayout(GAME_CONFIG, state);
        layout.materialCards = nextLayout.materialCards;
        layout.synthesisSlots = nextLayout.synthesisSlots;
        layout.adCards = nextLayout.adCards;
        layout.phoneTargets = nextLayout.phoneTargets;
        renderGame(ctx, state, layout);
        updateHud();

        if (state.gameOver && !endShown) {
          endShown = true;
          setTimeout(() => showEndScreen(state.victory), 800);
        }
      }
    );
  }

  updateHud();
  renderGame(ctx, state, layout);
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (canvas.width / rect.width);
  const y = (event.clientY - rect.top) * (canvas.height / rect.height);
  const btn = layout.synthesizeButtonRect;
  if (btn && x >= btn.x && x <= btn.x + btn.width && y >= btn.y && y <= btn.y + btn.height) {
    synthesizeAd(state);
  }
});
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

updateHud();
renderGame(ctx, state, layout);
