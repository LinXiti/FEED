export function buildLayout(config, state) {
  const npcWidth = config.width / 3;
  const npcTop = 100;
  const npcHeight = 440;
  const materials = [
    ...state.availableMaterials.formats,
    ...state.availableMaterials.hobbies,
    ...state.availableMaterials.emotions,
  ];

  const materialCards = materials.map((item, index) => {
    const columns = state.stage === 1 ? 2 : 3;
    const cardWidth = 180;
    const cardHeight = 100;
    const gap = 20;
    const startX = 40;
    const startY = 620;
    const col = index % columns;
    const row = Math.floor(index / columns);

    return {
      item,
      rect: {
        x: startX + col * (cardWidth + gap),
        y: startY + row * (cardHeight + gap),
        width: cardWidth,
        height: cardHeight,
      },
    };
  });

  const synthesisSlots = [
    {
      slotType: "format",
      rect: { x: 930, y: 640, width: 220, height: 100 },
    },
    {
      slotType: "hobby",
      rect: { x: 1170, y: 640, width: 220, height: 100 },
    },
    {
      slotType: "emotion",
      rect: { x: 1410, y: 640, width: 220, height: 100 },
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
