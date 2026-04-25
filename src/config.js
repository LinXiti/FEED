export const GAME_CONFIG = {
  width: 1920,
  height: 1080,
  totalTime: 240,
  phaseDurations: {
    phase1: 30,
    phase2: 90,
    phase3: 120,
  },
  npcDemandLifetime: 20,
  // NPC 顶部「需求气泡」的尺寸配置（canvasRenderer.js 会读取这里）
  demandBubble: {
    iconSize: 64,
    iconPad: 16,
    iconGap: 12,
    iconOffsetX: -3,
    iconOffsetY: -8,
    // 气泡相对 phone 的 Y 偏移（越大越往下）
    yOffset: 180,
  },
  synthesis: {
    slotIconScale: 0.85,
    slotIconTopPad: 8,
  },
  progressGain: {
    1: 4,
    2: 6,
    3: 9,
  },
  deliveryScoreGain: {
    1: 10,
    2: 30,
    3: 60,
  },
  maxProgress: 100,
};

export const MATERIAL_LIBRARY = {
  formats: [
    { id: "video", type: "format", label: "video", icon: "🎬" },
    { id: "text", type: "format", label: "text", icon: "📝" },
    { id: "image", type: "format", label: "image", icon: "🖼️" },
    { id: "email", type: "format", label: "email", icon: "📧" },
  ],
  hobbies: [
    { id: "digital", type: "hobby", label: "digital", icon: "📱" },
    { id: "game", type: "hobby", label: "game", icon: "🎮" },
    { id: "beauty", type: "hobby", label: "makeup", icon: "💄" },
    { id: "pet", type: "hobby", label: "pet", icon: "🐾" },
    { id: "movie", type: "hobby", label: "movie", icon: "🎬" },
    { id: "art", type: "hobby", label: "art", icon: "🎨" },
  ],
  emotions: [
    { id: "anger", type: "emotion", label: "angry", icon: "😠" },
    { id: "anticipation", type: "emotion", label: "anticipate", icon: "⏳" },
    { id: "happiness", type: "emotion", label: "happy", icon: "😊" },
    { id: "sadness", type: "emotion", label: "sad", icon: "😢" },
    { id: "surprise", type: "emotion", label: "astonish", icon: "😲" },
    { id: "trust", type: "emotion", label: "trust", icon: "🤝" },
  ],
};
