import { GAME_CONFIG, MATERIAL_LIBRARY } from "../config.js";
import { NPC_TEMPLATES } from "../data/npcs.js";
import { randomFrom } from "../utils/helpers.js";

function createDemandForStage(template, stage) {
  return {
    format: randomFrom(template.acceptableFormats),
    hobby: stage >= 2 ? randomFrom(template.hobbies) : null,
    emotion: stage >= 3 ? randomFrom(template.emotions) : null,
  };
}

function createNpcState(template, stage) {
  return {
    ...template,
    cocoonProgress: 0,
    countdown: GAME_CONFIG.npcDemandLifetime,
    demandCooldown: 0,
    demand: createDemandForStage(template, stage),
  };
}

export function createInitialGameState() {
  const stage = 1;
  const unlockedFeatures = ["Stage 1: Ad Formats"];

  return {
    stage,
    timeLeft: GAME_CONFIG.totalTime,
    phaseBanner: unlockedFeatures.join("\n"),
    unlockedFeatures,
    message: "Drag and drop assets to create ads",
    npcs: NPC_TEMPLATES.map((template) => createNpcState(template, stage)),
    availableMaterials: {
      formats: [...MATERIAL_LIBRARY.formats],
      hobbies: [],
      emotions: [],
    },
    synthesisSlots: {
      format: null,
      hobby: null,
      emotion: null,
    },
    pendingAds: [],
    score: 0,
    dragging: null,
    ui: {
      synthesizeHovered: false,
      synthesizePressed: false,
    },
    hoveredTarget: null,
    gameOver: false,
    victory: false,
  };
}

export function refreshNpcDemand(npc, stage) {
  npc.demand = createDemandForStage(npc, stage);
  npc.countdown = GAME_CONFIG.npcDemandLifetime;
  npc.demandCooldown = 0;
}
