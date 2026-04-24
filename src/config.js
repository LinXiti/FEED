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
    { id: "video", type: "format", label: "视频", icon: "🎬" },
    { id: "text", type: "format", label: "文字", icon: "📝" },
    { id: "image", type: "format", label: "图片", icon: "🖼️" },
    { id: "email", type: "format", label: "邮件", icon: "📧" },
  ],
  hobbies: [
    { id: "digital", type: "hobby", label: "数码", icon: "📱" },
    { id: "game", type: "hobby", label: "游戏", icon: "🎮" },
    { id: "beauty", type: "hobby", label: "美妆", icon: "💄" },
    { id: "pet", type: "hobby", label: "宠物", icon: "🐾" },
    { id: "movie", type: "hobby", label: "电影", icon: "🎬" },
    { id: "art", type: "hobby", label: "艺术", icon: "🎨" },
  ],
  emotions: [
    { id: "anger", type: "emotion", label: "愤怒", icon: "😠" },
    { id: "anticipation", type: "emotion", label: "期待", icon: "⏳" },
    { id: "happiness", type: "emotion", label: "快乐", icon: "😊" },
    { id: "sadness", type: "emotion", label: "悲伤", icon: "😢" },
    { id: "surprise", type: "emotion", label: "惊讶", icon: "😲" },
    { id: "trust", type: "emotion", label: "信任", icon: "🤝" },
  ],
};
