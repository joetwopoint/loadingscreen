// Loading screen logic for shorts + staff + tips

// ===================== CONFIG =========================

// ===== STATS CONFIG =====

// Discord Guild ID (enable the Discord "Server Widget" in your Discord server settings).
// This drives the "people in the email system" count.
var DISCORD_GUILD_ID = "1358478289038999552E"; // e.g. "123456789012345678"

// FiveM server HTTP endpoint (for players.json & info.json).
// This drives the "people in the state" count.
var FIVEM_SERVER_ENDPOINT = "15.204.57.143:30120";

// How often to refresh Discord/server stats (in milliseconds)
var STATS_REFRESH_MS = 30000;


// ===== BACKGROUND AUDIO (LOCAL MP3) =====
const AUDIO_ENABLED = true;          // master toggle for background music
let audioDefaultVolume = 0.1;        // 20% starting volume
let audioVolume = audioDefaultVolume;
let bgAudioElement = null;

// List of audio files to pick from (relative to html/)
// Drop multiple .mp3/.ogg files into html/audio and list them here.
const AUDIO_TRACKS = [
  "audio/Sun-Valley.mp3",
  "audio/Sun-ValleySky.mp3",
  "audio/Sun-ValleySkies.mp3",
  "audio/Sun-ValleyBurn.mp3",
  "audio/Sun-ValleyDreams.mp3",
];

// Staff toggle: set to true to show staff list column.
const STAFF_ENABLED = false;

// Staff members: only used if STAFF_ENABLED === true.
const staffMembers = [
  // Example:
  // {
  //   name: "Jane Doe",
  //   role: "Community Manager",
  //   description: "Handles support & questions.",
  //   image: "staff/jane.png"
  // }
];

// Shorts source:
// The phone frame uses **TikTok** clips only. Configure your TikTok URLs below.

// NOTE ABOUT VOLUME:
// Up/Down arrow keys adjust the logical volume percentage used by the UI
// and any optional background video (if you configure one).
// TikTok iframes do not expose volume to us, so the arrows will NOT change TikTok audio directly.

// TikTok links (pre-filled with example URLs)
const tikTokUrls = [
  "https://www.tiktok.com/@sunvalleyroleplay/video/7565518128927591711",
  "https://www.tiktok.com/@sunvalleyroleplay/video/7577016794569788702",
  "https://www.tiktok.com/@sunvalleyroleplay/video/7575985752375332127",
  "https://www.tiktok.com/@sunvalleyroleplay/video/7567100329674755359",
  "https://www.tiktok.com/@sunvalleyroleplay/video/7566234364057554207",
  "https://www.tiktok.com/@sunvalleyroleplay/video/7565874934048722206",
  "https://www.tiktok.com/@sunvalleyroleplay/video/7540003369935539487",
  "https://www.tiktok.com/@sunvalleyroleplay/video/7536165613924846879",
  "https://www.tiktok.com/@sunvalleyroleplay/video/7534080149491338509",
  "https://www.tiktok.com/@sunvalleyroleplay/video/7496361694399139115",
  "https://www.tiktok.com/@sunvalleyroleplay/video/7496356035360296238",
  "https://www.tiktok.com/@sunvalleyroleplay/video/7496353751230631214",
  "https://www.tiktok.com/@sunvalleyroleplay/photo/7494316754177395999",
  "https://www.tiktok.com/@sunvalleyroleplay/photo/7493511478784396587",
  "https://www.tiktok.com/@sunvalleyroleplay/video/7493494626968505646"
];


// ===== BACKGROUND VIDEO (OPTIONAL YOUTUBE) =====
// If enabled and at least one URL is provided, a fullscreen YouTube
// video will play softly behind the loading screen.
// Use regular **watch** URLs here (not Shorts).
const BACKGROUND_VIDEO_ENABLED = false; // background disabled to avoid YouTube error 153

const BACKGROUND_YT_URLS = [
  "https://www.youtube.com/watch?v=gQuAaHQrl8U&list=RDgQuAaHQrl8U&start_radio=1"
];


// Approximate time per clip before switching (ms)
const CLIP_DURATION_MS = 30000;

// Tips to rotate on the left panel
const tips = [
  "Be respectful to other players. RP > FRP.",
  "Read the rules in Discord before you hit the streets.",
  "Use push-to-talk and keep comms clear during scenes.",
  "Record your POV – it helps with reports and clips.",
  "Have fun, but remember: actions have consequences."
];

let currentUrl = null;
let currentProvider = null;
// Start around 20% 'logical' volume (for YouTube, this just means unmuted)
let volumePercent = 20;

// ===================== HELPERS =========================
function chooseRandom(arr) {
  if (!arr || arr.length === 0) return null;
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

function getActiveShortList() {
  // Shorts now come strictly from TikTok URLs.
  if (tikTokUrls && tikTokUrls.length) {
    return tikTokUrls.slice();
  }
  return [];
}

function detectProvider(url) {
  if (!url) return null;
  if (url.includes("tiktok.com")) return "tiktok";
  return "unknown";
}

function getTikTokVideoId(url) {
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : null;
}


function buildEmbedUrl(url) {
  const provider = detectProvider(url);
  currentProvider = provider;

  if (provider === "tiktok") {
    const videoId = getTikTokVideoId(url);
    if (!videoId) {
      // /photo/ and other forms – just let TikTok handle it directly.
      return url;
    }
    return `https://www.tiktok.com/player/v1/${videoId}?autoplay=1&loop=0`;
  }

  // Unknown provider or empty URL – just return the raw URL (may still load iframes/images).
  return url;
}

function setFrameToUrl(url) {
  const frame = document.getElementById("shortFrame");
  if (!frame) return;

  if (!url) {
    frame.src = "about:blank";
    return;
  }

  const embedUrl = buildEmbedUrl(url);
  frame.src = embedUrl;
}

function loadRandomShort() {
  const list = getActiveShortList();
  const url = chooseRandom(list);
  currentUrl = url || null;
  setFrameToUrl(currentUrl);
}

// ===================== VOLUME & UI =========================
function updateVolumeReadout() {
  const el = document.getElementById("volumeValue");
  if (el) el.textContent = `${volumePercent}%`;
}

function changeVolume(delta) {
  volumePercent = Math.max(0, Math.min(100, volumePercent + delta));
  updateVolumeReadout();

  // Only affects YouTube embeds (TikTok ignores this)
  if (currentUrl && currentProvider === "youtube") {
    setFrameToUrl(currentUrl);
  }
}

function setupVolumeKeys() {
  window.addEventListener("keydown", (e) => {
    const key = e.key || e.code || "";
    const kc = e.keyCode;

    if (key === "ArrowUp" || key === "Up" || kc === 38) {
      e.preventDefault();
      changeVolume(10);
    } else if (key === "ArrowDown" || key === "Down" || kc === 40) {
      e.preventDefault();
      changeVolume(-10);
    }
  });
}





// ===================== AUDIO CONTROL =========================
function pickRandomTrack() {
  if (!AUDIO_TRACKS || !AUDIO_TRACKS.length) return null;
  const index = Math.floor(Math.random() * AUDIO_TRACKS.length);
  return AUDIO_TRACKS[index];
}

function startRandomTrack() {
  if (!bgAudioElement) return;
  const track = pickRandomTrack();
  if (!track) return;

  bgAudioElement.src = track;
  bgAudioElement.currentTime = 0;

  try {
    bgAudioElement.volume = audioVolume;
  } catch (e) {}

  const playPromise = bgAudioElement.play();
  if (playPromise && playPromise.catch) {
    playPromise.catch(function() {
      // ignore autoplay requirement errors
    });
  }
}

function setupBackgroundAudio() {
  if (!AUDIO_ENABLED) return;
  bgAudioElement = document.getElementById("bgAudio");
  if (!bgAudioElement) return;

  // Start at default volume and wire 'ended' to play another random track
  audioVolume = audioDefaultVolume;
  try {
    bgAudioElement.volume = audioVolume;
  } catch (e) {}

  bgAudioElement.addEventListener("ended", function() {
    startRandomTrack();
  });

  startRandomTrack();
}

function changeAudioVolume(delta) {
  if (!bgAudioElement) return;
  audioVolume = Math.max(0, Math.min(1, audioVolume + delta));
  try {
    bgAudioElement.volume = audioVolume;
  } catch (e) {}
}

function toggleAudioPause() {
  if (!bgAudioElement) return;
  if (bgAudioElement.paused) {
    const playPromise = bgAudioElement.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function() {});
    }
  } else {
    bgAudioElement.pause();
  }
}

function setupAudioKeys() {
  window.addEventListener("keydown", function(e) {
    const key = e.key || e.code || "";
    const kc = e.keyCode;

    // Up arrow: volume up
    if (key === "ArrowUp" || key === "Up" || kc === 38) {
      e.preventDefault();
      changeAudioVolume(0.1); // +10%
    }
    // Down arrow: volume down
    else if (key === "ArrowDown" || key === "Down" || kc === 40) {
      e.preventDefault();
      changeAudioVolume(-0.1); // -10%
    }
    // Space: pause/resume
    else if (key === " " || key === "Spacebar" || kc === 32) {
      e.preventDefault();
      toggleAudioPause();
    }
  });
}

window.addEventListener("message", function (event) {
  var data = event.data;
  if (!data || typeof data !== "object") return;

  if (data.type === "dutyStats") {
    handleDutyStatsMessage(data);
  }
});


document.addEventListener("DOMContentLoaded", () => {
  updateVolumeReadout();
  setupVolumeKeys();
  setupBackgroundAudio();
  setupAudioKeys();
  loadRandomShort();
});

