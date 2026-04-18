export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function formatSeconds(seconds) {
  const safe = Math.max(0, Math.ceil(seconds));
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const remaining = String(safe % 60).padStart(2, "0");
  return `${minutes}:${remaining}`;
}
