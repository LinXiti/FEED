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

  const synthesisStartX = 1100;
  const synthesisStartY = 590;
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
  const pendingBoxY = 555;
  const pendingBoxW = 600;
  const pendingBoxH = 520;

  const synthesizeButtonRect = {
    x: pendingBoxX + 20,
    y: pendingBoxY + pendingBoxH - 60,
    width: pendingBoxW - 40,
    height: 45,
  };

  const adAreaX = pendingBoxX + 20;
  const adAreaY = pendingBoxY + 50;
  const adW = 260;
  const adH = 90;
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
    pendingBox: { x: pendingBoxX, y: pendingBoxY, width: pendingBoxW, height: pendingBoxH },
    synthesizeButtonRect,
  };
}
