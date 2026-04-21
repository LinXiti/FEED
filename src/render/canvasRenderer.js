import { formatSeconds } from "../utils/helpers.js";
import { GAME_CONFIG } from "../config.js";

function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle = null) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();

  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  }
}

function drawText(ctx, text, x, y, options = {}) {
  ctx.save();
  ctx.fillStyle = options.color ?? "#f3f6ff";
  ctx.font = options.font ?? "28px sans-serif";
  ctx.textAlign = options.align ?? "left";
  ctx.textBaseline = options.baseline ?? "alphabetic";

  const lines = String(text).split("\n");
  const fontSizeMatch = /(\d+(?:\.\d+)?)px/.exec(ctx.font);
  const defaultLineHeight = fontSizeMatch ? Number(fontSizeMatch[1]) * 1.2 : 32;
  const lineHeight = options.lineHeight ?? defaultLineHeight;

  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });

  ctx.restore();
}

function drawNpcPanel(ctx, npc, index, layout, state) {
  const x = index * layout.npcWidth + 20;
  const y = layout.npcTop;
  const width = layout.npcWidth - 40;
  const height = layout.npcHeight;
  const phone = layout.phoneTargets[index].rect;

  drawRoundedRect(ctx, x, y, width, height, 24, "rgba(255,255,255,0.05)", "rgba(255,255,255,0.12)");
  drawRoundedRect(ctx, phone.x, phone.y, phone.width, phone.height, 28, "rgba(255,255,255,0.08)", "rgba(255,215,120,0.35)");

  const isCompleted = npc.cocoonProgress >= GAME_CONFIG.maxProgress;
  const formatDemand = isCompleted ? "已完成" : (npc.demand.format ?? "等待中...");
  const hobbyDemand = state.stage >= 2 ? (isCompleted ? "已完成" : (npc.demand.hobby ?? "等待中...")) : "???";
  const emotionDemand = state.stage >= 3 ? (isCompleted ? "已完成" : (npc.demand.emotion ?? "等待中...")) : "???";

  drawText(ctx, npc.avatar, phone.x + 120, y + 90, { font: "72px sans-serif", align: "center" });
  drawText(ctx, npc.name, phone.x + 120, y + 140, { font: "28px sans-serif", align: "center" });
  drawText(ctx, `需求形式：${formatDemand}`, x + 290, y + 120, { font: "26px sans-serif" });
  drawText(ctx, `需求爱好：${hobbyDemand}`, x + 290, y + 170, { font: "24px sans-serif" });
  drawText(ctx, `需求情感：${emotionDemand}`, x + 290, y + 220, { font: "24px sans-serif" });

  const timerPercent = Math.max(0, npc.countdown / GAME_CONFIG.npcDemandLifetime);
  drawRoundedRect(ctx, x + width - 80, y + 80, 18, 220, 9, "rgba(255,255,255,0.12)");
  drawRoundedRect(ctx, x + width - 80, y + 80 + 220 * (1 - timerPercent), 18, 220 * timerPercent, 9, timerPercent > 0.5 ? "#53d66f" : timerPercent > 0.2 ? "#f2c14d" : "#ff6767");

  drawRoundedRect(ctx, x + width - 40, y + 80, 18, 220, 9, "rgba(255,255,255,0.12)");
  drawRoundedRect(ctx, x + width - 40, y + 80 + 220 * (1 - npc.cocoonProgress / 100), 18, 220 * (npc.cocoonProgress / 100), 9, "#52e0a1");
}

function drawMaterials(ctx, layout, state) {
  drawText(ctx, "素材池", 50, 590, { font: "34px sans-serif" });

  for (const card of layout.materialCards) {
    drawRoundedRect(ctx, card.rect.x, card.rect.y, card.rect.width, card.rect.height, 20, "#ffffff", "rgba(0,0,0,0.08)");
    drawText(ctx, card.item.label, card.rect.x + card.rect.width / 2, card.rect.y + card.rect.height / 2, {
      font: "28px sans-serif",
      color: "#222",
      align: "center",
      baseline: "middle",
    });
  }

  drawText(ctx, `当前阶段：${state.stage}`, 50, 1030, { font: "24px sans-serif", color: "rgba(243,246,255,0.7)" });
}

function drawSynthesis(ctx, layout, state) {
  const firstSlot = layout.synthesisSlots[0].rect;
  drawText(ctx, "合成区", firstSlot.x, firstSlot.y - 22, { font: "34px sans-serif" });

  for (const slot of layout.synthesisSlots) {
    const unlocked =
      slot.slotType === "format" ||
      (slot.slotType === "hobby" && state.stage >= 2) ||
      (slot.slotType === "emotion" && state.stage >= 3);

    drawRoundedRect(
      ctx,
      slot.rect.x,
      slot.rect.y,
      slot.rect.width,
      slot.rect.height,
      20,
      unlocked ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
      unlocked ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)"
    );

    const slotLabels = { format: "形式", hobby: "爱好", emotion: "情感" };
    const item = state.synthesisSlots[slot.slotType];
    const label = item ? item.label : unlocked ? slotLabels[slot.slotType] : "未解锁";
    drawText(ctx, label, slot.rect.x + slot.rect.width / 2, slot.rect.y + slot.rect.height / 2, {
      font: "24px sans-serif",
      align: "center",
      baseline: "middle",
    });
  }

  // Pending ads box
  const pb = layout.pendingBox;
  drawRoundedRect(ctx, pb.x, pb.y, pb.width, pb.height, 20, "rgba(255,255,255,0.04)", "rgba(255,255,255,0.12)");
  drawText(ctx, "待投放广告", pb.x + pb.width / 2, pb.y + 32, { font: "28px sans-serif", align: "center" });

  const draggingAdId = state.dragging?.kind === "ad" ? state.dragging.payload.id : null;
  for (const ad of layout.adCards) {
    if (ad.item.id === draggingAdId) continue;
    drawRoundedRect(ctx, ad.rect.x, ad.rect.y, ad.rect.width, ad.rect.height, 14, "rgba(255,255,255,0.9)");
    drawText(ctx, ad.item.format ?? "-", ad.rect.x + 16, ad.rect.y + 34, { font: "22px sans-serif", color: "#222" });
    drawText(ctx, ad.item.hobby ?? "-", ad.rect.x + 16, ad.rect.y + 62, { font: "19px sans-serif", color: "#444" });
    drawText(ctx, ad.item.emotion ?? "-", ad.rect.x + 140, ad.rect.y + 62, { font: "19px sans-serif", color: "#444" });
  }

  // Synthesize button
  const btn = layout.synthesizeButtonRect;
  drawRoundedRect(ctx, btn.x, btn.y, btn.width, btn.height, 12,
    "linear-gradient(180deg, rgba(255,214,109,0.28), rgba(243,164,59,0.2))",
    "rgba(255,255,255,0.18)"
  );
  // canvas doesn't support CSS gradients in fillStyle — use a solid approximation
  drawRoundedRect(ctx, btn.x, btn.y, btn.width, btn.height, 12, "rgba(243,190,80,0.22)", "rgba(255,255,255,0.22)");
  drawText(ctx, "合成广告", btn.x + btn.width / 2, btn.y + btn.height / 2, {
    font: "bold 22px sans-serif",
    align: "center",
    baseline: "middle",
  });
}

function drawDraggingPreview(ctx, dragging) {
  if (!dragging) return;

  const isMaterial = dragging.kind === "material";
  const size = 120;
  const width = isMaterial ? size : 180;
  const height = isMaterial ? size : 84;

  drawRoundedRect(ctx, dragging.x - width / 2, dragging.y - height / 2, width, height, 18, "rgba(255,255,255,0.82)");
  const label = isMaterial
    ? dragging.payload.label
    : `${dragging.payload.format}/${dragging.payload.hobby ?? "-"}/${dragging.payload.emotion ?? "-"}`;
  drawText(ctx, label, dragging.x, dragging.y, {
    font: "22px sans-serif",
    color: "#222",
    align: "center",
    baseline: "middle",
  });
}

export function renderGame(ctx, state, layout) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  gradient.addColorStop(0, "#1a1a2e");
  gradient.addColorStop(1, "#10172b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawText(ctx, `全局倒计时 ${formatSeconds(state.timeLeft)}`, 960, 60, {
    font: "bold 38px monospace",
    align: "center",
  });
  drawText(ctx, state.phaseBanner, 960, 102, { font: "24px sans-serif", align: "center", color: "#f3d56d" });

  state.npcs.forEach((npc, index) => drawNpcPanel(ctx, npc, index, layout, state));
  drawMaterials(ctx, layout, state);
  drawSynthesis(ctx, layout, state);
  drawDraggingPreview(ctx, state.dragging);
}
