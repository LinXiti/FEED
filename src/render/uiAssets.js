const BASE = "./assets/美术素材";

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function loadUiAssets() {
  const [
    portrait1, portrait2, portrait3,
    phone1, phone2, phone3,
    npcBubble1, npcBubble2, npcBubble3, npcBubbleText,
    pbTimer1, pbTimer2, pbTimer3, pbTimer4,
    pbCocoon1, pbCocoon2, cocoonIcon,
    iconVideo, iconPhoto, iconWord, iconEmail,
    iconDigital, iconGame, iconBeauty, iconPet, iconMovie, iconArt,
    iconAnger, iconAnticipation, iconHappiness, iconSadness, iconSurprise, iconTrust,
    slotFormat, slotHobby, slotEmotion, slotArea,
    synthBubbleFormat, synthBubbleHobby, synthBubbleEmotion,
    synthButton,
    startButton, restartButton, screenBg,
    hint,
  ] = await Promise.all([
    loadImage(`${BASE}/npc/肖像/portrait1.png`),
    loadImage(`${BASE}/npc/肖像/portrait2.png`),
    loadImage(`${BASE}/npc/肖像/portrait3.png`),
    loadImage(`${BASE}/npc/手机/phone1.png`),
    loadImage(`${BASE}/npc/手机/phone2.png`),
    loadImage(`${BASE}/npc/手机/phone3.png`),
    loadImage(`${BASE}/npc/气泡/pupple1.png`),
    loadImage(`${BASE}/npc/气泡/pupple2.png`),
    loadImage(`${BASE}/npc/气泡/pupple3.png`),
    loadImage(`${BASE}/npc/气泡/tetx pupple.png`),
    loadImage(`${BASE}/npc/进度条/progressbar1.png`),
    loadImage(`${BASE}/npc/进度条/progressbar2.png`),
    loadImage(`${BASE}/npc/进度条/progressbar3.png`),
    loadImage(`${BASE}/npc/进度条/progressbar4.png`),
    loadImage(`${BASE}/npc/进度条/cocoon progressbar1.png`),
    loadImage(`${BASE}/npc/进度条/cocoon progressbar2.png`),
    loadImage(`${BASE}/npc/进度条/cocoon icon.png`),
    loadImage(`${BASE}/图标/形式维度/video.png`),
    loadImage(`${BASE}/图标/形式维度/photo.png`),
    loadImage(`${BASE}/图标/形式维度/word.png`),
    loadImage(`${BASE}/图标/形式维度/email.png`),
    loadImage(`${BASE}/图标/内容维度/digital.png`),
    loadImage(`${BASE}/图标/内容维度/game.png`),
    loadImage(`${BASE}/图标/内容维度/beauty.png`),
    loadImage(`${BASE}/图标/内容维度/pet.png`),
    loadImage(`${BASE}/图标/内容维度/movie.png`),
    loadImage(`${BASE}/图标/内容维度/art.png`),
    loadImage(`${BASE}/图标/情感维度/anger.png`),
    loadImage(`${BASE}/图标/情感维度/anticipation.png`),
    loadImage(`${BASE}/图标/情感维度/happiness.png`),
    loadImage(`${BASE}/图标/情感维度/sadness.png`),
    loadImage(`${BASE}/图标/情感维度/surpirse.png`),
    loadImage(`${BASE}/图标/情感维度/trust.png`),
    loadImage(`${BASE}/广告生成区/slot1.png`),
    loadImage(`${BASE}/广告生成区/slot2.png`),
    loadImage(`${BASE}/广告生成区/slot3.png`),
    loadImage(`${BASE}/广告生成区/slot4.png`),
    loadImage(`${BASE}/广告生成区/pupple1.png`),
    loadImage(`${BASE}/广告生成区/pupple2.png`),
    loadImage(`${BASE}/广告生成区/pupple3.png`),
    loadImage(`${BASE}/广告生成区/button.png`),
    loadImage(`${BASE}/开始&结束页面/start button.png`),
    loadImage(`${BASE}/开始&结束页面/restart button.png`),
    loadImage(`${BASE}/开始&结束页面/background.jpg`),
    loadImage(`${BASE}/背景及电脑屏幕/hint.png`),
  ]);

  const background = await loadImage("./assets/美术素材/背景及电脑屏幕/background.jpg");
  const bottomHalf = await loadImage("./assets/美术素材/背景及电脑屏幕/bottom_half.jpg");

  return {
    dom: {
      start: { normal: startButton, hover: startButton, active: startButton },
      restart: { normal: restartButton, hover: restartButton, active: restartButton },
      screenBg,
    },
    canvas: {
      portraits: [portrait1, portrait2, portrait3],
      phones: [phone1, phone2, phone3],
      npcBubbles: [npcBubble1, npcBubble2, npcBubble3],
      npcBubbleText,
      timerBars: [pbTimer1, pbTimer2, pbTimer3, pbTimer4],
      cocoonBars: [pbCocoon1, pbCocoon2],
      cocoonIcon,
      icons: {
        // format
        video: iconVideo, photo: iconPhoto, word: iconWord, email: iconEmail,
        // hobby
        digital: iconDigital, game: iconGame, beauty: iconBeauty,
        pet: iconPet, movie: iconMovie, art: iconArt,
        // emotion
        anger: iconAnger, anticipation: iconAnticipation, happiness: iconHappiness,
        sadness: iconSadness, surprise: iconSurprise, trust: iconTrust,
      },
      slots: [slotFormat, slotHobby, slotEmotion],
      slotArea,
      synthBubbles: [synthBubbleFormat, synthBubbleHobby, synthBubbleEmotion],
      synthButton,
      background,
      bottomHalf,
      hint,
    },
  };
}
