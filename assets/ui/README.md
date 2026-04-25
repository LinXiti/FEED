# UI 按钮美术素材接入说明

本项目有两类“按钮”：

1) DOM 按钮：开始/重新开始（`#start-button` / `#restart-button`，样式在 `style.css`）
2) Canvas 按钮：画布内的“合成广告”（绘制逻辑在 `src/render/canvasRenderer.js`）

为方便美术直接替换，这里约定三态 PNG（可按需只给 normal）：

## DOM 按钮素材命名（放到本目录）

- `btn_start_normal.png`
- `btn_start_hover.png`（可选）
- `btn_start_active.png`（可选）
- `btn_restart_normal.png`
- `btn_restart_hover.png`（可选）
- `btn_restart_active.png`（可选）

JS 会在image加载成功后，自动给对应按钮加上 `art-button` 类，并用素材作为背景图。

## Canvas “合成广告”按钮素材命名（放到本目录）

- `btn_synthesize_normal.png`
- `btn_synthesize_hover.png`（可选）
- `btn_synthesize_active.png`（可选）

渲染时会优先绘制素材；若素材缺失或加载失败，会自动回退到原来的圆角+text按钮。

