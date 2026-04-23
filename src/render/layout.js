export function buildLayout(config, state) {
  const npcWidth = config.width / 3;
  const npcTop = 100;
  const npcHeight = 440;

  const cardSize = 120;
  const gap = 20;
  const startX = 100;
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

  const synthesisStartX = 1050;
  const synthesisStartY = 650;
  const synthesisSlots = [
    {
      slotType: "format",
      rect: { x: synthesisStartX, y: synthesisStartY, width: cardSize, height: cardSize },
    },
    {
      slotType: "hobby",
      rect: { x: synthesisStartX, y: synthesisStartY + cardSize + gap, width: cardSize, height: cardSize },
    },
    {
      slotType: "emotion",
      rect: { x: synthesisStartX, y: synthesisStartY + (cardSize + gap) * 2, width: cardSize, height: cardSize },
    },
  ];

  const pendingBoxX = synthesisStartX + cardSize + 30;
  const pendingBoxY = 550;
  const pendingBoxW = 600;
  const pendingBoxH = 380;

  const synthesizeButtonRect = {
    x: pendingBoxX + 60,
    y: pendingBoxY + pendingBoxH - 60,
    width: pendingBoxW - 100,
    height: 100,
  };

  const adAreaX = pendingBoxX + 20;
  const adAreaY = pendingBoxY + 100;
  const adW = 300;
  const adH = 120;
  const adGapX = 20;
  const adGapY = 15;

  const adCards = state.pendingAds.map((item, index) => ({
    item,
    rect: {
      x: adAreaX + (index % 2) * (adW + adGapX),
      y: adAreaY + Math.floor(index / 2) * (adH + adGapY),
      width: adW,
      height: adH,
    },
  }));

  const phoneTargets = state.npcs.map((npc, index) => ({
    npcId: npc.id,
    rect: {
      x: index * npcWidth + 120,
      y: -50,      // leave ~200px above for bubble
      width: 48*7,  // 48*4
      height: 80*7, // 80*4
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
    pendingBox: { x: pendingBoxX, y: pendingBoxY, width: pendingBoxW, height: pendingBoxH },
    synthesizeButtonRect,
  };
}
