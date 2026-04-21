function resolveCanvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function isInsideRect(point, rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export function createDragSystem({ canvas, state, layout, onMaterialDropped, onAdDropped, onAdRemoved }) {
  function onPointerDown(event) {
    const point = resolveCanvasPoint(canvas, event);

    for (const material of layout.materialCards) {
      if (isInsideRect(point, material.rect)) {
        state.dragging = { kind: "material", payload: material.item, x: point.x, y: point.y };
        return;
      }
    }

    for (const ad of layout.adCards) {
      if (isInsideRect(point, ad.rect)) {
        state.dragging = { kind: "ad", payload: ad.item, x: point.x, y: point.y };
        return;
      }
    }
  }

  function onPointerMove(event) {
    if (!state.dragging) return;
    const point = resolveCanvasPoint(canvas, event);
    state.dragging.x = point.x;
    state.dragging.y = point.y;
  }

  function onContextMenu(event) {
    const point = resolveCanvasPoint(canvas, event);
    const ad = layout.adCards.find((card) => isInsideRect(point, card.rect));
    if (!ad) return;
    event.preventDefault();
    onAdRemoved?.(ad.item.id);
    state.dragging = null;
  }

  function onPointerUp(event) {
    if (!state.dragging) return;
    const point = resolveCanvasPoint(canvas, event);

    if (state.dragging.kind === "material") {
      const targetSlot = layout.synthesisSlots.find((slot) => isInsideRect(point, slot.rect));
      if (targetSlot) onMaterialDropped(state.dragging.payload, targetSlot.slotType);
    }

    if (state.dragging.kind === "ad") {
      const targetNpc = layout.phoneTargets.find((target) => isInsideRect(point, target.rect));
      if (targetNpc) onAdDropped(state.dragging.payload.id, targetNpc.npcId);
    }

    state.dragging = null;
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("contextmenu", onContextMenu);
  canvas.addEventListener("pointerup", onPointerUp);

  return {
    destroy() {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("contextmenu", onContextMenu);
      canvas.removeEventListener("pointerup", onPointerUp);
    },
  };
}
