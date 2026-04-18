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
  progressGain: {
    1: 4,
    2: 6,
    3: 9,
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
    { id: "sports", type: "hobby", label: "运动", icon: "⚽" },
    { id: "food", type: "hobby", label: "美食", icon: "🍔" },
    { id: "tech", type: "hobby", label: "科技", icon: "💻" },
    { id: "fashion", type: "hobby", label: "时尚", icon: "👗" },
    { id: "game", type: "hobby", label: "游戏", icon: "🎮" },
    { id: "music", type: "hobby", label: "音乐", icon: "🎵" },
  ],
  emotions: [
    { id: "excited", type: "emotion", label: "兴奋", icon: "😆" },
    { id: "calm", type: "emotion", label: "平静", icon: "😌" },
    { id: "anxious", type: "emotion", label: "焦虑", icon: "😰" },
    { id: "joyful", type: "emotion", label: "愉悦", icon: "😊" },
    { id: "angry", type: "emotion", label: "愤怒", icon: "😠" },
    { id: "curious", type: "emotion", label: "好奇", icon: "🤔" },
  ],
};
