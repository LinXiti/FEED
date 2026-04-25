import { GAME_CONFIG } from "../config.js";

// pixel-art helper: draw image with no smoothing
function drawPixel(ctx, img, dx, dy, dw, dh) {
  if (!img) return;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

function drawText(ctx, text, x, y, options = {}) {
  ctx.save();
  ctx.fillStyle = options.color ?? "#f3f6ff";
  ctx.font = options.font ?? "28px sans-serif";
  ctx.textAlign = options.align ?? "left";
  ctx.textBaseline = options.baseline ?? "alphabetic";
  const lines = String(text).split("\n");
  const m = /(\d+(?:\.\d+)?)px/.exec(ctx.font);
  const lh = options.lineHeight ?? (m ? Number(m[1]) * 1.2 : 32);
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * lh));
  ctx.restore();
}

// map material id → icon key in uiAssets.canvas.icons
const ICON_KEY = {
  video: "video", image: "photo", text: "word", email: "email",
  digital: "digital", game: "game", beauty: "beauty", pet: "pet", movie: "movie", art: "art",
  anger: "anger", anticipation: "anticipation", happiness: "happiness",
  sadness: "sadness", surprise: "surprise", trust: "trust",
};

function getIcon(uiAssets, id) {
  return uiAssets?.canvas?.icons?.[ICON_KEY[id]] ?? null;
}

// pick which timer bar image to use based on percent (full→empty = bar1→bar4)
function timerBarImg(uiAssets, percent) {
  const bars = uiAssets?.canvas?.timerBars;
  if (!bars) return null;
  if (percent > 0.75) return bars[0];
  if (percent > 0.5)  return bars[1];
  if (percent > 0.25) return bars[2];
  return bars[3];
}

function drawNpcPanel(ctx, npc, index, layout, state, uiAssets) {
  const phone = layout.phoneTargets[index].rect;
  const a = uiAssets?.canvas;

  // phone frame
  const phoneImg = a?.phones?.[index] ?? null;
  if (phoneImg) {
    drawPixel(ctx, phoneImg, phone.x, phone.y, phone.width, phone.height);
  } else {
    ctx.save();
    ctx.strokeStyle = "rgba(255,215,120,0.35)";
    ctx.strokeRect(phone.x, phone.y, phone.width, phone.height);
    ctx.restore();
  }

  // portrait — centred inside phone
  const portraitImg = a?.portraits?.[index] ?? null;
  const portraitSize = Math.min(phone.width, phone.height) * 0.35;
  const portraitX = phone.x + (phone.width - portraitSize) / 2-10;
  const portraitY = -30+phone.y + (phone.height - portraitSize) / 2;
  if (portraitImg) {
    drawPixel(ctx, portraitImg, portraitX, portraitY, portraitSize, portraitSize);
  } else {
    drawText(ctx, npc.avatar, phone.x + phone.width / 2, phone.y + phone.height / 2,
      { font: "96px sans-serif", align: "center", baseline: "middle" });
  }

  // cocoon progress bar — use processbar1 as container and grow fill by percent
  const cocoonFill = Math.max(0, Math.min(1, npc.cocoonProgress / GAME_CONFIG.maxProgress));
  const cbX = phone.x + phone.width + 40;
  const cbH = Math.round(phone.height * 0.6);
  const cbY = phone.y + (phone.height - cbH) / 2;
  const cbW = 28;
  const cocoonBg = a?.timerBars?.[0] ?? null;
  if (cocoonBg) drawPixel(ctx, cocoonBg, cbX, cbY, cbW, cbH);
  if (cocoonFill > 0) {
    const innerPadX = 6;
    const innerPadY = 10;
    const innerX = cbX + innerPadX;
    const innerY = cbY + innerPadY;
    const innerW = Math.max(0, cbW - innerPadX * 2);
    const innerH = Math.max(0, cbH - innerPadY * 2);
    const fillH = Math.round(innerH * cocoonFill);
    const fillY = innerY + innerH - fillH;
    ctx.save();
    ctx.fillStyle = "rgba(140, 92, 255, 0.95)";
    ctx.fillRect(innerX, fillY, innerW, fillH);
    ctx.restore();
  }
  const ciImg = a?.cocoonIcon ?? null;
  if (ciImg) drawPixel(ctx, ciImg, cbX, cbY - 28, cbW, 22);

  const hasDemand = npc.countdown > 0 && npc.demand?.format;
  if (!hasDemand) return;

  // build demand icon list
  const isCompleted = npc.cocoonProgress >= GAME_CONFIG.maxProgress;
  const demandIds = [];
  if (!isCompleted) {
    // map label → material id for icon lookup
    const LABEL_TO_ID = {
      "video": "video", "image": "image", "text": "text", "email": "email",
      "digital": "digital", "game": "game", "makeup": "beauty", "pet": "pet", "movie": "movie", "art": "art",
      "angry": "anger", "anticipate": "anticipation", "happy": "happiness",
      "sad": "sadness", "astonish": "surprise", "trust": "trust",
    };
    if (npc.demand.format) demandIds.push(LABEL_TO_ID[npc.demand.format] ?? npc.demand.format);
    if (state.stage >= 2 && npc.demand.hobby) demandIds.push(LABEL_TO_ID[npc.demand.hobby] ?? npc.demand.hobby);
    if (state.stage >= 3 && npc.demand.emotion) demandIds.push(LABEL_TO_ID[npc.demand.emotion] ?? npc.demand.emotion);
  }

  const iconSize = 96;
  const iconPad = 32; // padding inside bubble on each side
  const iconGap = 24; // gap between icons inside bubble
  const n = isCompleted ? 1 : demandIds.length;

  // pick bubble by demand count (1→pupple1, 2→pupple2, 3→pupple3)
  const bubbleImgs = a?.npcBubbles ?? [];
  const bubbleImg = bubbleImgs[Math.min(n, 3) - 1] ?? bubbleImgs[0] ?? null;

  // bubble sized to snugly wrap icons
  const bubbleW = iconPad * 2 + iconSize * n + iconGap * (n - 1);
  const bubbleH = iconPad * 2 + iconSize;

  // position bubble centred above phone, with a small gap
  const bubbleX = phone.x + (phone.width - bubbleW) / 2;
  const bubbleYOffset = GAME_CONFIG.demandBubble?.yOffset ?? 200;
  const bubbleY = Math.max(0, phone.y - bubbleH + bubbleYOffset);

  // countdown timer bar — fixed container attached to bubble left side;
  // inner fill shrinks vertically from bottom to top
  const timerPercent = Math.max(0, npc.countdown / GAME_CONFIG.npcDemandLifetime);
  const tbW = 16;
  const tbGap = -5;
  const tbPad = 10;
  const tbX = bubbleX - tbW - tbGap;
  const tbY = bubbleY;
  const tbH = bubbleH*0.9;
  const timerBg = uiAssets?.canvas?.timerBars?.[0] ?? null;
  if (timerBg) drawPixel(ctx, timerBg, tbX, tbY, tbW, tbH);
  if (timerPercent > 0) {
    const innerX = tbX + tbPad;
    const innerY = tbY + tbPad;
    const innerW = tbW - tbPad * 2;
    const innerH = tbH - tbPad * 2;
    const fillH = Math.round(innerH * timerPercent);
    const fillY = innerY + innerH - fillH;
    ctx.save();
    const timerColor = timerPercent <= 0.2 ? "rgba(220,50,50,0.95)"
      : timerPercent <= 0.4 ? "rgba(230,180,0,0.95)"
      : "rgba(60,200,80,0.95)";
    ctx.fillStyle = timerColor;
    ctx.fillRect(innerX, fillY, innerW, fillH);
    ctx.restore();
  }

  if (bubbleImg) {
    drawPixel(ctx, bubbleImg, bubbleX, bubbleY, bubbleW, bubbleH);
  } else {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fillRect(bubbleX, bubbleY, bubbleW, bubbleH);
    ctx.restore();
  }

  if (isCompleted) {
    drawText(ctx, "✓", bubbleX + bubbleW / 2, bubbleY + bubbleH / 2,
      { font: "bold 40px sans-serif", color: "#2ecc71", align: "center", baseline: "middle" });
  } else {
    demandIds.forEach((id, i) => {
      const icon = getIcon(uiAssets, id);
      const ix = bubbleX + iconPad + i * (iconSize + iconGap)-2;
      const iy = bubbleY + iconPad-5;
      if (icon) {
        drawPixel(ctx, icon, ix, iy, iconSize, iconSize);
      }
    });
  }


}

function drawMaterials(ctx, layout, state, uiAssets) {
  for (const card of layout.materialCards) {
    const { x, y, width, height } = card.rect;
    const icon = getIcon(uiAssets, card.item.id);
    const iconPad = 6;
    const iconSize = width - iconPad * 2;

    if (icon) {
      drawPixel(ctx, icon, x + iconPad, y + iconPad, iconSize, iconSize);
    }
  }
}

function drawSynthesis(ctx, layout, state, uiAssets) {
  const a = uiAssets?.canvas;

  // overall synthesis area background (slot4)
  const slotArea = a?.slotArea ?? null;
  const pb = layout.pendingBox;
  // slot area covers synthesis slots + pending box
  const areaX = layout.synthesisSlots[0].rect.x - 20;
  const areaY = layout.synthesisSlots[0].rect.y -8;
  const areaW = pb.x + pb.width - areaX + 20;
  const areaH = pb.height + 40;
  if (slotArea) {
    drawPixel(ctx, slotArea, areaX, areaY, areaW, areaH);
  } else {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(areaX, areaY, areaW, areaH);
    ctx.strokeRect(areaX, areaY, areaW, areaH);
    ctx.restore();
  }

  // synthesis slots
  const slotImgs = a?.slots ?? [];
  const synthBubbles = a?.synthBubbles ?? [];
  const slotTypeIndex = { format: 0, hobby: 1, emotion: 2 };

  for (const slot of layout.synthesisSlots) {
    const { x, y, width, height } = slot.rect;
    const si = slotTypeIndex[slot.slotType];
    const unlocked =
      slot.slotType === "format" ||
      (slot.slotType === "hobby" && state.stage >= 2) ||
      (slot.slotType === "emotion" && state.stage >= 3);

    // slot frame
    const slotImg = slotImgs[si] ?? null;
    if (slotImg) {
      ctx.save();
      if (!unlocked) ctx.globalAlpha = 0.3;
      drawPixel(ctx, slotImg, x, y, width, height);
      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = unlocked ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)";
      ctx.fillRect(x, y, width, height);
      ctx.restore();
    }

    // content: icon, or bubble image
    const item = state.synthesisSlots[slot.slotType];
    if (item) {
      const icon = getIcon(uiAssets, item.id);
      const bubbleImg = synthBubbles[si] ?? null;
      if (bubbleImg) {
        drawPixel(ctx, bubbleImg, x + 4, y + 4, width - 8, height - 8);
      }
      if (icon) {
        const iconScale = GAME_CONFIG.synthesis?.slotIconScale ?? 0.5;
        const iconTopPad = GAME_CONFIG.synthesis?.slotIconTopPad ?? 8;
        const iconSize = width * iconScale;
        drawPixel(ctx, icon, x + (width - iconSize) / 2, y + iconTopPad, iconSize, iconSize);
      }
    }
  }

  // pending ads
  const draggingAdId = state.dragging?.kind === "ad" ? state.dragging.payload.id : null;
  for (const ad of layout.adCards) {
    if (ad.item.id === draggingAdId) continue;
    const { x, y, width, height } = ad.rect;
    // ad card bg using synthBubble[0] as generic card bg, fallback plain
    const adBg = synthBubbles[0] ?? null;
    if (adBg) {
      drawPixel(ctx, adBg, x, y, width, height);
    } else {
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillRect(x, y, width, height);
      ctx.restore();
    }

    // icons for format / hobby / emotion
    const fIcon = getIcon(uiAssets, ad.item.formatId ?? ad.item.format);
    const hIcon = getIcon(uiAssets, ad.item.hobbyId ?? ad.item.hobby);
    const eIcon = getIcon(uiAssets, ad.item.emotionId ?? ad.item.emotion);
    const iconH = 72;
    if (fIcon) drawPixel(ctx, fIcon, x + 30, y + (height - iconH) / 2, iconH, iconH);
    if (hIcon) drawPixel(ctx, hIcon, x + 30 + iconH + 6, y + (height - iconH) / 2, iconH, iconH);
    if (eIcon) drawPixel(ctx, eIcon, x + 30 + (iconH + 6) * 2, y + (height - iconH) / 2, iconH, iconH);

  }

  // synthesize button
  const btn = layout.synthesizeButtonRect;
  const btnImg = a?.synthButton ?? null;
  if (btnImg) {
    drawPixel(ctx, btnImg, btn.x, btn.y, btn.width, btn.height);
    drawText(ctx, "CREATE AD", btn.x + btn.width / 2, btn.y + btn.height / 2, {
      font: '40px "Unifont"',
      color: "#f3f6ff",
      align: "center",
      baseline: "middle",
    });
  } else {
    ctx.save();
    ctx.fillStyle = "rgba(243,190,80,0.22)";
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
    ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);
    ctx.restore();
    drawText(ctx, "CREATE AD", btn.x + btn.width / 2, btn.y + btn.height / 2, {
      font: '40px "Unifont"',
      color: "#f3f6ff",
      align: "center",
      baseline: "middle",
    });
  }
}

function drawHint(ctx, layout, uiAssets) {
  // hint bar at bottom — use hint.png stretched across material area
  const hintImg = uiAssets?.canvas?.hint ?? null;
  if (!hintImg) return;
  const cards = layout.materialCards;
  if (!cards.length) return;
  const xs = cards.map(c => c.rect.x);
  const ys = cards.map(c => c.rect.y + c.rect.height);
  const hintX = Math.min(...xs) - 10;
  const hintY = Math.max(...ys) + 16;
  const hintW = 700;
  const hintH = 60;
  drawPixel(ctx, hintImg, hintX, hintY, hintW, hintH);
}

function drawDraggingPreview(ctx, dragging, uiAssets) {
  if (!dragging) return;
  const isMaterial = dragging.kind === "material";
  const w = isMaterial ? 100 : 160;
  const h = isMaterial ? 100 : 72;
  const x = dragging.x - w / 2;
  const y = dragging.y - h / 2;

  ctx.save();
  ctx.globalAlpha = 0.85;
  if (isMaterial) {
    const icon = getIcon(uiAssets, dragging.payload.id);
    const slotBg = uiAssets?.canvas?.slots?.[0] ?? null;
    if (slotBg) drawPixel(ctx, slotBg, x, y, w, h);
    if (icon) drawPixel(ctx, icon, x + 10, y + 10, w - 20, h - 20);
  } else {
    const adBg = uiAssets?.canvas?.synthBubbles?.[0] ?? null;
    if (adBg) drawPixel(ctx, adBg, x, y, w, h);

    const fIcon = getIcon(uiAssets, dragging.payload.formatId ?? dragging.payload.format);
    const hIcon = getIcon(uiAssets, dragging.payload.hobbyId ?? dragging.payload.hobby);
    const eIcon = getIcon(uiAssets, dragging.payload.emotionId ?? dragging.payload.emotion);
    const iconH = 28;
    const totalW = iconH * 3 + 6 * 2;
    const startX = dragging.x - totalW / 2;
    const iy = dragging.y - iconH / 2;
    if (fIcon) drawPixel(ctx, fIcon, startX, iy, iconH, iconH);
    if (hIcon) drawPixel(ctx, hIcon, startX + iconH + 6, iy, iconH, iconH);
    if (eIcon) drawPixel(ctx, eIcon, startX + (iconH + 6) * 2, iy, iconH, iconH);
  }
  ctx.restore();
}

export function renderGame(ctx, state, layout, uiAssets = null) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // background
  const bg = uiAssets?.canvas?.background ?? null;
  if (bg) {
    drawPixel(ctx, bg, 0, 0, ctx.canvas.width, ctx.canvas.height);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(1, "#10172b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  // bottom-half background for materials + synthesis area
  const bottomHalf = uiAssets?.canvas?.bottomHalf ?? null;
  if (bottomHalf) {
    const srcW = bottomHalf.naturalWidth || bottomHalf.width || 1;
    const srcH = bottomHalf.naturalHeight || bottomHalf.height || 1;
    const aspectH = srcH / srcW;
    let topY = Math.round(ctx.canvas.height - ctx.canvas.width * aspectH);

    const candidateYs = [];
    if (layout?.pendingBox?.y != null) candidateYs.push(layout.pendingBox.y);
    if (Array.isArray(layout?.synthesisSlots)) candidateYs.push(...layout.synthesisSlots.map((s) => s.rect.y));
    if (Array.isArray(layout?.materialCards)) candidateYs.push(...layout.materialCards.map((c) => c.rect.y));
    if (candidateYs.length) {
      const uiTop = Math.max(0, Math.round(Math.min(...candidateYs) - 20));
      topY = Math.min(topY, uiTop);
    }

    topY = Math.max(0, Math.min(ctx.canvas.height, topY));
    drawPixel(ctx, bottomHalf, 0, topY, ctx.canvas.width, ctx.canvas.height - topY);
  }

  state.npcs.forEach((npc, i) => drawNpcPanel(ctx, npc, i, layout, state, uiAssets));
  drawMaterials(ctx, layout, state, uiAssets);
  drawSynthesis(ctx, layout, state, uiAssets);
  drawDraggingPreview(ctx, state.dragging, uiAssets);
}
