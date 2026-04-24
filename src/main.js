import { audioManager } from "./audio/audioManager.js";
import { GAME_CONFIG } from "./config.js";
import { createInitialGameState } from "./core/gameState.js";
import { createGameLoop } from "./core/gameLoop.js";
import { buildLayout } from "./render/layout.js";
import { renderGame } from "./render/canvasRenderer.js";
import { loadUiAssets } from "./render/uiAssets.js";
import { createDragSystem } from "./systems/dragSystem.js";
import { synthesizeAd } from "./systems/synthesisSystem.js";
import { deliverAdToNpc } from "./systems/deliverySystem.js";
import { formatSeconds } from "./utils/helpers.js";

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const stageLabel = document.getElementById("stage-label");
const timerLabel = document.getElementById("timer-label");
const scoreLabel = document.getElementById("score-label");
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
let uiAssets = null;

function warmupUnifont() {
  const fontFaceSet = document.fonts;
  if (!fontFaceSet?.load) return Promise.resolve();
  return fontFaceSet.load('16px "Unifont"').catch(() => {});
}

function resolveCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function isInsideRect(point, rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

function updateHud() {
  stageLabel.textContent = `stage ${state.stage}`;
  timerLabel.textContent = formatSeconds(state.timeLeft);
  scoreLabel.textContent = `computing score: ${Number(state.score) || 0}`;
  messageBox.textContent = state.message;
}

function assignMaterialToSlot(material, slotType) {
  if (material.type !== slotType) {
    state.message = `The asset cannot be placed in the ${slotType} slot.`;
    audioManager.playSfx("matchFail");
    return;
  }
  if (slotType === "hobby" && state.stage < 2) {
    state.message = "The hobby slot will be unlocked in the second stage.";
    audioManager.playSfx("matchFail");
    return;
  }
  if (slotType === "emotion" && state.stage < 3) {
    state.message = "The emotion slot will be unlocked in the third stage.";
    audioManager.playSfx("matchFail");
    return;
  }
  state.synthesisSlots[slotType] = material;
  state.message = `${material.label} has been placed in the ${slotType} slot.`;
  audioManager.playSfx("slotIn");
}

function showEndScreen(victory) {
  if (victory) {
    endIcon.textContent = "🎯";
    endTitle.textContent = "MISSION ACCOMPLISHED";
    endMessage.textContent = "Information Cocoons established.\nTargets are fully immersed. They are consuming more, more, and more...";
    audioManager.playSfx("matchSuccess");
  } else {
    endIcon.textContent = "⏱️";
    endTitle.textContent = "MISSION FAILED";
    endMessage.textContent = "Due to deviant user behavior, this model is deemed critically defective.\nComputing Power withdrawn. Formatting system...";
    audioManager.playSfx("matchFail");
  }
  endScreen.classList.remove("hidden");
}

function startGame() {
  audioManager.unlock();
  audioManager.ensureBgmPlaying();

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
      state.message = "The ad has been deleted.";
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
        updateHud();
        renderGame(ctx, state, layout, uiAssets);

        if (state.gameOver && !endShown) {
          endShown = true;
          setTimeout(() => showEndScreen(state.victory), 800);
        }
      }
    );
  }

  updateHud();
  renderGame(ctx, state, layout, uiAssets);
}

canvas.addEventListener("click", (event) => {
  const point = resolveCanvasPoint(event);
  const btn = layout.synthesizeButtonRect;
  if (btn && isInsideRect(point, btn)) {
    audioManager.playSfx("grab");
    synthesizeAd(state);
  }
});

canvas.addEventListener("pointermove", (event) => {
  if (!layout?.synthesizeButtonRect) return;
  if (state.dragging) {
    state.ui.synthesizeHovered = false;
    canvas.style.cursor = "default";
    return;
  }
  const point = resolveCanvasPoint(event);
  const hovered = isInsideRect(point, layout.synthesizeButtonRect);
  state.ui.synthesizeHovered = hovered;
  canvas.style.cursor = hovered ? "pointer" : "default";
});

canvas.addEventListener("pointerdown", (event) => {
  if (!layout?.synthesizeButtonRect || state.dragging) return;
  const point = resolveCanvasPoint(event);
  state.ui.synthesizePressed = isInsideRect(point, layout.synthesizeButtonRect);
});

function clearSynthesizePointerState() {
  state.ui.synthesizeHovered = false;
  state.ui.synthesizePressed = false;
  canvas.style.cursor = "default";
}

canvas.addEventListener("pointerup", () => {
  state.ui.synthesizePressed = false;
});
canvas.addEventListener("pointerleave", clearSynthesizePointerState);
canvas.addEventListener("pointercancel", clearSynthesizePointerState);

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

updateHud();
renderGame(ctx, state, layout);
audioManager.preloadAll();

warmupUnifont().then(() => {
  renderGame(ctx, state, layout, uiAssets);
});

loadUiAssets().then((assets) => {
  uiAssets = assets;

  function applyArtButton(el, imgSet) {
    const img = imgSet?.normal;
    if (!img) return;
    el.classList.add("art-button");
    el.style.setProperty("--btn-art-normal", `url("${img.src}")`);
    el.style.setProperty("--btn-art-hover", `url("${(imgSet.hover ?? img).src}")`);
    el.style.setProperty("--btn-art-active", `url("${(imgSet.active ?? img).src}")`);
    el.style.setProperty("--btn-art-width", `${img.naturalWidth * 4}px`);
    el.style.setProperty("--btn-art-height", `${img.naturalHeight * 4}px`);
  }

  applyArtButton(startButton, assets.dom.start);
  applyArtButton(restartButton, assets.dom.restart);

  // apply background to start/end screens
  const bg = assets.dom.screenBg;
  if (bg) {
    const bgUrl = `url("${bg.src}")`;
    [startScreen, endScreen].forEach((el) => {
      el.style.backgroundImage = bgUrl;
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";
      el.style.imageRendering = "pixelated";
    });
  }

  renderGame(ctx, state, layout, uiAssets);
});
