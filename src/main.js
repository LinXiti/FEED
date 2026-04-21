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
const synthesizeButton = document.getElementById("synthesize-button");

canvas.width = GAME_CONFIG.width;
canvas.height = GAME_CONFIG.height;

const state = createInitialGameState();
const layout = buildLayout(GAME_CONFIG, state);

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

createDragSystem({
  canvas,
  state,
  layout,
  onMaterialDropped: assignMaterialToSlot,
  onAdDropped: (adId, npcId) => {
    deliverAdToNpc(state, adId, npcId);
  },
  onAdRemoved: (adId) => {
    const adIndex = state.pendingAds.findIndex((ad) => ad.id === adId);
    if (adIndex === -1) return;
    state.pendingAds.splice(adIndex, 1);
    state.message = "广告已删除。";
  },
});

synthesizeButton.addEventListener("click", () => {
  synthesizeAd(state);
});

createGameLoop(state, () => {
  const nextLayout = buildLayout(GAME_CONFIG, state);
  layout.materialCards = nextLayout.materialCards;
  layout.synthesisSlots = nextLayout.synthesisSlots;
  layout.adCards = nextLayout.adCards;
  layout.phoneTargets = nextLayout.phoneTargets;
  renderGame(ctx, state, layout);
  updateHud();
});

updateHud();
renderGame(ctx, state, layout);
