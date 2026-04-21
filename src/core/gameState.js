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
  const unlockedFeatures = ["第一阶段：投放形式"];

  return {
    stage,
    timeLeft: GAME_CONFIG.totalTime,
    phaseBanner: unlockedFeatures.join("\n"),
    unlockedFeatures,
    message: "把素材拖进合成槽，生成广告后投放给对应 NPC。",
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
    dragging: null,
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
