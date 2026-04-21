export function buildLayout(config, state) {
  const npcWidth = config.width / 3;
  const npcTop = 100;
  const npcHeight = 440;

  const cardSize = 120;
  const gap = 20;
  const startX = 40;
  const startY = 620;

  const formatCards = state.availableMaterials.formats.map((item, index) => ({
    item,
    rect: {
      x: startX + index * (cardSize + gap),
      y: startY,
      width: cardSize,
      height: cardSize,
    },
  }));

  const hobbyRowY = startY + cardSize + gap;
  const hobbyCards = state.availableMaterials.hobbies.map((item, index) => ({
    item,
    rect: {
      x: startX + index * (cardSize + gap),
      y: hobbyRowY,
      width: cardSize,
      height: cardSize,
    },
  }));

  const emotionRowY = hobbyRowY + cardSize + gap;
  const emotionCards = state.availableMaterials.emotions.map((item, index) => ({
    item,
    rect: {
      x: startX + index * (cardSize + gap),
      y: emotionRowY,
      width: cardSize,
      height: cardSize,
    },
  }));

  const materialCards = [...formatCards, ...hobbyCards, ...emotionCards];

  const synthesisStartX = 930;
  const synthesisY = 640;
  const synthesisSlots = [
    {
      slotType: "format",
      rect: { x: synthesisStartX, y: synthesisY, width: cardSize, height: cardSize },
    },
    {
      slotType: "hobby",
      rect: { x: synthesisStartX + (cardSize + gap), y: synthesisY, width: cardSize, height: cardSize },
    },
    {
      slotType: "emotion",
      rect: { x: synthesisStartX + (cardSize + gap) * 2, y: synthesisY, width: cardSize, height: cardSize },
    },
  ];

  const adCards = state.pendingAds.map((item, index) => ({
    item,
    rect: {
      x: 930 + (index % 2) * 260,
      y: 820 + Math.floor(index / 2) * 120,
      width: 220,
      height: 90,
    },
  }));

  const phoneTargets = state.npcs.map((npc, index) => ({
    npcId: npc.id,
    rect: {
      x: index * npcWidth + 50,
      y: 160,
      width: 240,
      height: 320,
    },
  }));

  return {
    npcWidth,
    npcTop,
    npcHeight,
    materialCards,
    synthesisSlots,
    adCards,
    phoneTargets,
  };
}
