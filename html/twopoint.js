// Loading screen logic for shorts + staff + most wanted + tips

// Shared config bridge: parent owns music, both designs read assets/config from html/shared-config.js
const SHARED_LOADSCREEN = window.SharedLoadscreenConfig || {};
const SHARED_DISCORD = SHARED_LOADSCREEN.discord || {};
const SHARED_MUSIC = SHARED_LOADSCREEN.music || {};

function cloneSharedList(key) {
  const list = SHARED_LOADSCREEN && Array.isArray(SHARED_LOADSCREEN[key]) ? SHARED_LOADSCREEN[key] : [];
  return list.map((item) => Object.assign({}, item));
}


// ===================== CONFIG =========================

// ===== STATS CONFIG =====

// Discord invite code used to draw the widget-style card.
// Put only the invite code, not the full URL.
// Examples:
//   discord.gg/abc123 -> "abc123"
//   discord.com/invite/abc123 -> "abc123"
var DISCORD_INVITE_CODE = SHARED_DISCORD.inviteCode || "TeCxSpC5wf";

// Optional custom endpoint/proxy for the invite widget JSON. Leave blank for direct Discord invite API.
// Direct mode uses: https://discord.com/api/v10/invites/YOUR_CODE?with_counts=true
var DISCORD_INVITE_WIDGET_ENDPOINT = SHARED_DISCORD.widgetEndpoint || "";

// Optional manual fallback while setting up the invite code.
// Leave null for automatic tracking.
var DISCORD_WIDGET_FALLBACK = SHARED_DISCORD.fallback || { name: "Discord Server", online: null, members: null, description: "Set discord.inviteCode in shared-config.js to show the Discord widget." };

// FiveM server HTTP endpoint (for players.json & info.json).
// This drives the "people in the state" count.
var FIVEM_SERVER_ENDPOINT = SHARED_LOADSCREEN.fallbackServerEndpoint || "http://15.204.91.117:30120";

// Optional: your cfx.re join code. Example: if your join link is cfx.re/join/abc123, set this to "abc123".
// This is used as a fallback when FIVEM_SERVER_ENDPOINT is blank.
var CFX_SERVER_CODE = SHARED_LOADSCREEN.cfxServerCode || "3pxp7z";

// PoliceEMSActivity resource folder name. This must match the folder name used in resources/.
// If your folder is renamed, update this value or set POLICE_EMS_ACTIVITY_DUTY_ENDPOINT below.
var POLICE_EMS_ACTIVITY_RESOURCE_NAME = SHARED_LOADSCREEN.policeEMSActivityResourceName || "PoliceEMSActivity";

// Optional full PoliceEMSActivity duty JSON endpoint. Leave blank to auto-use:
// FIVEM_SERVER_ENDPOINT + /POLICE_EMS_ACTIVITY_RESOURCE_NAME/policeemsactivity-duty.json
// This endpoint is provided by the patched PoliceEMSActivity resource, not this loading screen.
var POLICE_EMS_ACTIVITY_DUTY_ENDPOINT = "";

// How often to refresh PoliceEMSActivity duty stats (5 minutes, in milliseconds).
var POLICE_EMS_ACTIVITY_DUTY_REFRESH_MS = 3000;

// Departments to display in the on-duty box. These match your PoliceEMSActivity Config.RoleList.
const DUTY_DEPARTMENTS = [
  { key: "lspd", label: "👮 LSPD", aliases: ["lspd", "los santos police", "police"], color: 57 },
  { key: "bcso", label: "👮 BCSO", aliases: ["bcso", "sheriff", "blaine county"], color: 52 },
  { key: "sasp", label: "👮 SASP", aliases: ["sasp", "state", "state police", "highway patrol", "trooper"], color: 54 },
  { key: "fire", label: "👨‍🚒 Fire", aliases: ["fire", "fd", "safr", "firefighter"], color: 1 },
  { key: "ems", label: "🚑 EMS", aliases: ["ems", "ambulance", "medical", "medic"], color: 63 }
];

// How often to refresh Discord widget + server stats (5 minutes, in milliseconds)
var STATS_REFRESH_MS = Number(SHARED_LOADSCREEN.statsRefreshMs) || 3000;


// ===== REAL FIVEM LOAD PROGRESS =====
// true = use FiveM's real loading percentage instead of a fake looping bar.
// FiveM sends load progress as a message event with loadFraction from 0 to 1.
const REAL_LOAD_PROGRESS_ENABLED = true;
const REAL_LOAD_PROGRESS_SMOOTHING = true;
const REAL_LOAD_PROGRESS_SHOW_PERCENT = true;

// ===== BACKGROUND AUDIO (LOCAL MP3) =====
const AUDIO_ENABLED = false;          // master toggle for background music
let audioDefaultVolume = Number(SHARED_MUSIC.volume) || 0.12;        // 20% starting volume
let audioVolume = audioDefaultVolume;
let bgAudioElement = null;
let audioTrackIndex = 0;


// true = show clickable music controls in the top-left corner.
// Requires loadscreen_cursor 'yes' in fxmanifest.lua so players can use the mouse.
const MUSIC_PLAYER_WIDGET_ENABLED = false;
const MUSIC_PLAYER_RANDOM_FIRST_TRACK = true;
const MUSIC_PLAYER_SHOW_TRACK_NAME = true;

// List of audio files to pick from (relative to html/)
// Drop multiple .mp3/.ogg files into html/audio and list them here.
const AUDIO_TRACKS = Array.isArray(SHARED_MUSIC.playlist) ? SHARED_MUSIC.playlist.map((track) => track.file).filter(Boolean) : [];

// ===== CENTER FEATURE PANELS =====
// The middle panel can show Staff, Most Wanted, or Gallery.
// Set FEATURE_PANEL_MODE to "single" to show one panel only.
// Set FEATURE_PANEL_MODE to "rotate" to cycle through every enabled panel in FEATURE_ROTATION_ORDER.
// Panel keys: "staff", "mostwanted", "gallery"
const FEATURE_PANEL_MODE = "rotate";
const SINGLE_FEATURE_PANEL = "mostwanted";
const FEATURE_ROTATION_INTERVAL_MS = 8000;
const FEATURE_ROTATION_ORDER = ["staff", "mostwanted", "gallery"];

// ===== FEATURE PANEL SIZE CONFIG =====
// These make all three center panels bigger/smaller without editing style.css.
// Good range: 1.00 to 1.18. Current default is a little larger than before.
const FEATURE_PANEL_SCALE = 1.05;

// Normal layout width when left info + phone panel are visible.
const FEATURE_PANEL_WIDTH_VW = 56;
const FEATURE_PANEL_MAX_WIDTH_PX = 1080;

// Wider layout width when the phone/TikTok panel is disabled.
const FEATURE_PANEL_NO_PHONE_WIDTH_VW = 72;
const FEATURE_PANEL_NO_PHONE_MAX_WIDTH_PX = 1240;

// Max panel height. Increase if the board feels too short; decrease if it overlaps.
const FEATURE_PANEL_MAX_HEIGHT_VH = 94;

// Staff sizing.
const STAFF_CARD_MIN_HEIGHT_PX = 152;
const STAFF_AVATAR_SIZE_PX = 112;

// Gallery sizing.
const GALLERY_CARD_MIN_HEIGHT_PX = 265;
const GALLERY_IMAGE_MIN_HEIGHT_PX = 225;

// Most Wanted board sizing. Increase this if the wanted board still feels too small.
const MOST_WANTED_BOARD_MAX_WIDTH_PX = 850;
const MOST_WANTED_BOARD_MAX_HEIGHT_VH = 92;

// ===== STAFF CONFIG =====
// true = make the Staff panel available as the single/rotating center panel.
const STAFF_ENABLED = true;
const STAFF_PHOTO_FIT = "contain";
const STAFF_PHOTO_POSITION = "center center";

// Six staff slots. Put staff images in html/staff/ and use paths like "assets/staff/jane.png".
const staffMembers = cloneSharedList('staff').map((person) => ({
  name: person.name || 'Staff Member',
  role: person.role || 'Staff',
  description: person.description || '',
  image: person.image || 'assets/staff/placeholder.png',
  photoFit: person.imageFit || person.photoFit || 'cover',
  photoPosition: person.imagePosition || person.photoPosition || 'center center'
}));

// ===== MOST WANTED BOARD CONFIG =====
// true = make the Most Wanted board available as the single/rotating center panel.
const MOST_WANTED_ENABLED = true;
const MOST_WANTED_PHOTO_FIT = "contain";
const MOST_WANTED_PHOTO_POSITION = "center center";

// Six wanted slots. Put mugshots in html/wanted/ and use paths like "assets/wanted/suspect.png".
// Keep descriptions short so they fit cleanly under each photo.
const MOST_WANTED_SUSPECTS = cloneSharedList('wanted').map((suspect) => ({
  name: suspect.name || 'Unknown Suspect',
  reason: suspect.reason || suspect.charge || 'Wanted',
  image: suspect.image || 'assets/wanted/placeholder.png',
  photoFit: suspect.imageFit || suspect.photoFit || 'cover',
  photoPosition: suspect.imagePosition || suspect.photoPosition || 'center center'
}));

// ===== GALLERY CONFIG =====
// true = make the Gallery panel available as the single/rotating center panel.
const GALLERY_ENABLED = true;
const GALLERY_PHOTO_FIT = "contain";
const GALLERY_PHOTO_POSITION = "center center";
// false = gallery cards are image-only, with no titles/descriptions under them.
const GALLERY_SHOW_CAPTIONS = false;

// Six gallery photo slots. Put images in html/gallery/ and use paths like "assets/gallery/event1.png".
const GALLERY_PHOTOS = cloneSharedList('gallery').map((photo, index) => ({
  title: photo.title || photo.name || `Gallery ${index + 1}`,
  description: photo.description || '',
  image: photo.image || 'assets/gallery/placeholder.png',
  photoFit: photo.imageFit || photo.photoFit || 'cover',
  photoPosition: photo.imagePosition || photo.photoPosition || 'center center'
}));


// Shorts source:
// The phone frame uses **TikTok** clips only. Configure your TikTok URLs below.


// Master toggle for the right-side phone/TikTok video panel.
// true  = show the phone frame and load TikTok videos from tikTokUrls
// false = hide the phone frame and do not load any TikTok iframe
const PHONE_TIKTOK_ENABLED = true;

// TikTok audio/playback config:
// - Set TIKTOK_MUTED_BY_DEFAULT to true if you want players to hear the local AUDIO_TRACKS instead of TikTok audio.
// - Set it to false if you want the loading screen to try to unmute TikTok audio.
// - TikTok's iframe controls volume internally, so TIKTOK_TARGET_VOLUME_PERCENT is best-effort.
//   The script sends volume messages when supported and still shows the TikTok volume button to players.
const TIKTOK_MUTED_BY_DEFAULT = true;
const TIKTOK_TARGET_VOLUME_PERCENT = 15;
const TIKTOK_SHOW_CONTROLS = true;
const TIKTOK_RANDOMIZE_FIRST_CLIP = true;
const TIKTOK_AUTO_ADVANCE = true;

// TikTok links. Videos play in this exact order, then loop back to the first.
const tikTokUrls = [
   "https://www.tiktok.com/@graveyard_shift_rp/video/7649392289466387725",
  "https://www.tiktok.com/@graveyard_shift_rp/video/7552955657746418957",
  "https://www.tiktok.com/@graveyard_shift_rp/video/7550377797995302158",
  "https://www.tiktok.com/@graveyard_shift_rp/video/7549433613318769975",
  "https://www.tiktok.com/@graveyard_shift_rp/video/7544468486249024823",
  "https://www.tiktok.com/@graveyard_shift_rp/video/7544411266853489933",
  "https://www.tiktok.com/@graveyard_shift_rp/video/7515204589436767534",
  "https://www.tiktok.com/@graveyard_shift_rp/video/7541007316179602743"
];


// ===== BACKGROUND VIDEO (OPTIONAL YOUTUBE) =====
// Fullscreen YouTube background behind the loading screen.
// This is independent from the right-side phone/TikTok panel above.
// true  = show the YouTube background iframe
// false = keep only the static gradient/logo background
const BACKGROUND_VIDEO_ENABLED = false;

// Use normal YouTube links here. Supported formats include:
// - https://www.youtube.com/watch?v=VIDEO_ID
// - https://youtu.be/VIDEO_ID
// - https://www.youtube.com/shorts/VIDEO_ID
// The script converts them to proper /embed/ URLs automatically.
const BACKGROUND_YT_URLS = [
  "https://www.youtube.com/watch?v=gQuAaHQrl8U"
];

// Background YouTube playback settings. Muted autoplay is the most reliable in CEF/NUI.
const BACKGROUND_YOUTUBE_MUTED = true;
const BACKGROUND_YOUTUBE_SHOW_CONTROLS = false;
const BACKGROUND_YOUTUBE_LOOP = true;
const BACKGROUND_YOUTUBE_RANDOMIZE_FIRST = true;

// Set true only if regular youtube.com embeds are blocked for you.
// Some setups prefer youtube-nocookie.com, others prefer youtube.com, so this is configurable.
const BACKGROUND_YOUTUBE_USE_NOCOOKIE = false;


// Fallback time before switching clips if TikTok does not send an ended event (ms).
// TikTok normally sends onStateChange=0 when a video ends, but this timer keeps the list moving even if that message is missed.
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
let activeShortList = [];
let currentShortIndex = -1;
let shortAdvanceTimer = null;
let lastTikTokPlayerState = null;
// Start at the configured TikTok target volume percentage.
let volumePercent = Math.max(0, Math.min(100, Number(TIKTOK_TARGET_VOLUME_PERCENT) || 25));

// ===================== HELPERS =========================
function chooseRandom(arr) {
  if (!arr || arr.length === 0) return null;
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

function getActiveShortList() {
  // Shorts now come strictly from TikTok URLs, unless the phone panel is disabled.
  if (!PHONE_TIKTOK_ENABLED) return [];
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

    const params = new URLSearchParams({
      autoplay: "1",
      loop: "0",
      controls: TIKTOK_SHOW_CONTROLS ? "1" : "0",
      progress_bar: "1",
      play_button: "1",
      volume_control: "1",
      muted: TIKTOK_MUTED_BY_DEFAULT ? "1" : "0",
      rel: "0"
    });

    return `https://www.tiktok.com/player/v1/${videoId}?${params.toString()}`;
  }

  // Unknown provider or empty URL – just return the raw URL (may still load iframes/images).
  return url;
}

function sendTikTokPlayerMessage(type, value) {
  const frame = document.getElementById("shortFrame");
  if (!frame || !frame.contentWindow) return;

  const message = { type: type, "x-tiktok-player": true };
  if (typeof value !== "undefined") message.value = value;

  try {
    frame.contentWindow.postMessage(message, "*");
  } catch (e) {}
}

function applyTikTokAudioSettings() {
  if (currentProvider !== "tiktok") return;

  // Tell the player to start/continue playback after each iframe load.
  sendTikTokPlayerMessage("play");

  if (TIKTOK_MUTED_BY_DEFAULT || volumePercent <= 0) {
    sendTikTokPlayerMessage("mute");
    return;
  }

  // TikTok officially supports unMute/mute. Volume percent messages are best-effort because
  // TikTok does not guarantee external volume control in every embed/browser build.
  sendTikTokPlayerMessage("unMute");
  sendTikTokPlayerMessage("setVolume", volumePercent);
  sendTikTokPlayerMessage("volume", volumePercent);
}

function scheduleTikTokAudioApply() {
  // TikTok can take a moment to finish booting inside the iframe, so retry a few times.
  [300, 900, 1800, 3500].forEach((delay) => {
    setTimeout(applyTikTokAudioSettings, delay);
  });
}

function clearShortAdvanceTimer() {
  if (shortAdvanceTimer) {
    clearTimeout(shortAdvanceTimer);
    shortAdvanceTimer = null;
  }
}

function scheduleShortAdvance() {
  clearShortAdvanceTimer();
  if (!TIKTOK_AUTO_ADVANCE || !CLIP_DURATION_MS || CLIP_DURATION_MS <= 0) return;

  shortAdvanceTimer = setTimeout(() => {
    loadNextShort("timer");
  }, CLIP_DURATION_MS);
}

function rebuildShortList() {
  activeShortList = getActiveShortList();

  if (!activeShortList.length) {
    currentShortIndex = -1;
    return;
  }

  if (TIKTOK_RANDOMIZE_FIRST_CLIP) {
    currentShortIndex = Math.floor(Math.random() * activeShortList.length);
  } else {
    currentShortIndex = 0;
  }
}

function setFrameToUrl(url) {
  const frame = document.getElementById("shortFrame");
  if (!frame) return;

  if (!PHONE_TIKTOK_ENABLED || !url) {
    clearShortAdvanceTimer();
    frame.src = "about:blank";
    return;
  }

  const embedUrl = buildEmbedUrl(url);
  lastTikTokPlayerState = null;
  frame.src = embedUrl;
  scheduleTikTokAudioApply();
  scheduleShortAdvance();
}

function loadShortAtIndex(index) {
  if (!activeShortList.length) rebuildShortList();
  if (!activeShortList.length) {
    currentUrl = null;
    setFrameToUrl(null);
    return;
  }

  const total = activeShortList.length;
  currentShortIndex = ((index % total) + total) % total;
  currentUrl = activeShortList[currentShortIndex];
  setFrameToUrl(currentUrl);
}

function loadNextShort(reason) {
  if (!activeShortList.length) rebuildShortList();
  if (!activeShortList.length) return;

  loadShortAtIndex(currentShortIndex + 1);
}

function loadRandomShort() {
  // Kept for compatibility with the old startup call. It now starts the ordered TikTok playlist.
  rebuildShortList();
  loadShortAtIndex(currentShortIndex);
}

function handleTikTokPlayerMessage(data) {
  if (!data || !data["x-tiktok-player"]) return;

  if (data.type === "onPlayerReady") {
    applyTikTokAudioSettings();
    return;
  }

  if (data.type === "onStateChange") {
    lastTikTokPlayerState = data.value;

    // TikTok state 0 = ended. Move to the next configured URL immediately.
    if (Number(data.value) === 0 && TIKTOK_AUTO_ADVANCE) {
      clearShortAdvanceTimer();
      setTimeout(() => loadNextShort("ended"), 250);
    }
    return;
  }

  if (data.type === "onPlayerError" && TIKTOK_AUTO_ADVANCE) {
    // Skip invalid/unavailable TikToks instead of leaving the phone frame stuck.
    clearShortAdvanceTimer();
    setTimeout(() => loadNextShort("error"), 1500);
  }
}

// ===================== VOLUME & UI =========================
function updateVolumeReadout() {
  const el = document.getElementById("volumeValue");
  if (el) el.textContent = `${volumePercent}%`;
}

function changeVolume(delta) {
  volumePercent = Math.max(0, Math.min(100, volumePercent + delta));
  updateVolumeReadout();

  if (currentProvider === "tiktok") {
    applyTikTokAudioSettings();
  } else if (currentUrl && currentProvider === "youtube") {
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









// ===================== BACKGROUND YOUTUBE =========================
function getYouTubeHost() {
  return BACKGROUND_YOUTUBE_USE_NOCOOKIE ? "www.youtube-nocookie.com" : "www.youtube.com";
}

function extractYouTubeVideoId(url) {
  if (!url) return null;

  const raw = String(url).trim();
  if (!raw) return null;

  // Allow admins to paste just the video ID.
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      return parsed.pathname.split("/").filter(Boolean)[0] || null;
    }

    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (parsed.searchParams.get("v")) return parsed.searchParams.get("v");

      const parts = parsed.pathname.split("/").filter(Boolean);
      const embedLike = ["embed", "shorts", "live", "v"];
      if (parts.length >= 2 && embedLike.includes(parts[0])) return parts[1];
    }
  } catch (e) {
    // Last chance for pasted strings that still contain a YouTube id.
    const match = raw.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }

  return null;
}

function extractYouTubePlaylistId(url) {
  if (!url) return null;
  try {
    const parsed = new URL(String(url).trim());
    return parsed.searchParams.get("list") || null;
  } catch (e) {
    const match = String(url).match(/[?&]list=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
}

function buildBackgroundYouTubeEmbedUrl(url) {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;

  const host = getYouTubeHost();
  const params = new URLSearchParams({
    autoplay: "1",
    mute: BACKGROUND_YOUTUBE_MUTED ? "1" : "0",
    controls: BACKGROUND_YOUTUBE_SHOW_CONTROLS ? "1" : "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    enablejsapi: "1",
    widget_referrer: window.location.href
  });

  // Passing origin helps YouTube identify the embedder in webview/NUI contexts.
  if (window.location && window.location.origin && window.location.origin !== "null") {
    params.set("origin", window.location.origin);
  }

  const playlistId = extractYouTubePlaylistId(url);
  if (playlistId && !playlistId.toUpperCase().startsWith("RD")) {
    params.set("list", playlistId);
  }

  if (BACKGROUND_YOUTUBE_LOOP) {
    params.set("loop", "1");
    // YouTube requires playlist=VIDEO_ID for single-video looping.
    if (!params.has("list")) params.set("playlist", videoId);
  }

  return `https://${host}/embed/${videoId}?${params.toString()}`;
}

function getBackgroundYouTubeUrl() {
  if (!Array.isArray(BACKGROUND_YT_URLS) || !BACKGROUND_YT_URLS.length) return null;

  const validUrls = BACKGROUND_YT_URLS.filter((url) => extractYouTubeVideoId(url));
  if (!validUrls.length) return null;

  if (BACKGROUND_YOUTUBE_RANDOMIZE_FIRST) return chooseRandom(validUrls);
  return validUrls[0];
}

function setupBackgroundYouTube() {
  const layer = document.getElementById("backgroundVideoLayer");
  const frame = document.getElementById("backgroundYoutubeFrame");
  if (!layer || !frame) return false;

  if (!BACKGROUND_VIDEO_ENABLED) {
    layer.style.display = "none";
    frame.src = "about:blank";
    document.body.classList.remove("has-background-video");
    return false;
  }

  const sourceUrl = getBackgroundYouTubeUrl();
  const embedUrl = buildBackgroundYouTubeEmbedUrl(sourceUrl);

  if (!embedUrl) {
    layer.style.display = "none";
    frame.src = "about:blank";
    document.body.classList.remove("has-background-video");
    console.warn("BACKGROUND_VIDEO_ENABLED is true, but no valid BACKGROUND_YT_URLS video ID was found.");
    return false;
  }

  frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
  frame.src = embedUrl;
  layer.style.display = "block";
  document.body.classList.add("has-background-video");
  return true;
}

// ===================== OPTIONAL CENTER FEATURE PANELS =========================
let activeFeatureKey = null;
let featureRotationTimer = null;

const FEATURE_PANEL_DEFINITIONS = {
  staff: {
    id: "staffPanel",
    enabled: () => !!STAFF_ENABLED,
    setup: setupStaffPanel,
    onShow: null,
    onHide: null
  },
  mostwanted: {
    id: "wantedBoardPanel",
    enabled: () => !!MOST_WANTED_ENABLED,
    setup: setupMostWantedBoard,
    onShow: null,
    onHide: null
  },
  gallery: {
    id: "galleryPanel",
    enabled: () => !!GALLERY_ENABLED,
    setup: setupGalleryPanel,
    onShow: null,
    onHide: null
  }
};

function setupPhoneTikTokPanel() {
  const panel = document.getElementById("phoneVideoPanel");

  if (!PHONE_TIKTOK_ENABLED) {
    document.body.classList.add("no-phone-layout");
    if (panel) panel.style.display = "none";
    setFrameToUrl(null);
    return false;
  }

  document.body.classList.remove("no-phone-layout");
  if (panel) panel.style.display = "";
  return true;
}

function setCssNumberVar(name, value, unit, fallback) {
  const numeric = Number(value);
  const safeValue = Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
  document.documentElement.style.setProperty(name, `${safeValue}${unit || ""}`);
}

function applyFeaturePanelSizingConfig() {
  setCssNumberVar("--feature-panel-scale", FEATURE_PANEL_SCALE, "", 1.0);
  setCssNumberVar("--feature-panel-width", FEATURE_PANEL_WIDTH_VW, "vw", 44);
  setCssNumberVar("--feature-panel-max-width", FEATURE_PANEL_MAX_WIDTH_PX, "px", 760);
  setCssNumberVar("--feature-panel-no-phone-width", FEATURE_PANEL_NO_PHONE_WIDTH_VW, "vw", 62);
  setCssNumberVar("--feature-panel-no-phone-max-width", FEATURE_PANEL_NO_PHONE_MAX_WIDTH_PX, "px", 980);
  setCssNumberVar("--feature-panel-max-height", FEATURE_PANEL_MAX_HEIGHT_VH, "vh", 88);
  setCssNumberVar("--staff-card-min-height", STAFF_CARD_MIN_HEIGHT_PX, "px", 98);
  setCssNumberVar("--staff-avatar-size", STAFF_AVATAR_SIZE_PX, "px", 64);
  setCssNumberVar("--gallery-card-min-height", GALLERY_CARD_MIN_HEIGHT_PX, "px", 210);
  setCssNumberVar("--gallery-image-min-height", GALLERY_IMAGE_MIN_HEIGHT_PX, "px", 130);
  setCssNumberVar("--wanted-board-max-width", MOST_WANTED_BOARD_MAX_WIDTH_PX, "px", 680);
  setCssNumberVar("--wanted-board-max-height", MOST_WANTED_BOARD_MAX_HEIGHT_VH, "vh", 88);
}

function setPanelVisibility(panel, isVisible) {
  if (!panel) return;
  panel.style.display = isVisible ? "flex" : "none";
  panel.classList.toggle("is-active", !!isVisible);
}

function getFirstSix(list) {
  return (Array.isArray(list) ? list.filter(Boolean) : []).slice(0, 6);
}

function createFallbackMessage(className, text) {
  const empty = document.createElement("div");
  empty.className = className;
  empty.textContent = text;
  return empty;
}

function setupStaffPanel() {
  const panel = document.getElementById("staffPanel");
  const list = document.getElementById("staffList");
  if (!panel || !list) return false;

  list.innerHTML = "";

  if (!STAFF_ENABLED) {
    document.body.classList.add("no-staff-layout");
    setPanelVisibility(panel, false);
    return false;
  }

  document.body.classList.remove("no-staff-layout");
  const rows = getFirstSix(staffMembers);

  if (!rows.length) {
    list.appendChild(createFallbackMessage("staff-empty", "Add up to six staff members in staffMembers inside script.js."));
  } else {
    rows.forEach((member) => {
      const card = document.createElement("div");
      card.className = "staff-card";

      const avatarWrap = document.createElement("div");
      avatarWrap.className = "staff-avatar-wrap";

      const img = document.createElement("img");
      img.src = member.image || "assets/staff/placeholder.png";
      img.alt = member.name || "Staff";
      img.style.objectFit = member.photoFit || STAFF_PHOTO_FIT || "cover";
      img.style.objectPosition = member.photoPosition || STAFF_PHOTO_POSITION || "center center";
      img.onerror = function () {
        this.onerror = null;
        this.src = "assets/staff/placeholder.png";
      };
      avatarWrap.appendChild(img);

      const meta = document.createElement("div");
      meta.className = "staff-meta";

      const name = document.createElement("div");
      name.className = "staff-name";
      name.textContent = member.name || "Staff Member";

      const role = document.createElement("div");
      role.className = "staff-role";
      role.textContent = member.role || "Staff";

      const desc = document.createElement("div");
      desc.className = "staff-desc";
      desc.textContent = member.description || "";

      meta.appendChild(name);
      meta.appendChild(role);
      if (desc.textContent) meta.appendChild(desc);

      card.appendChild(avatarWrap);
      card.appendChild(meta);
      list.appendChild(card);
    });
  }

  setPanelVisibility(panel, false);
  return true;
}

function setWantedSlot(index, suspect) {
  const photo = document.getElementById(`mwPhoto${index}`);
  const name = document.getElementById(`mwName${index}`);
  const reason = document.getElementById(`mwReason${index}`);

  if (!photo || !name || !reason) return;

  const safeSuspect = suspect || {};
  const desc = safeSuspect.reason || safeSuspect.description || safeSuspect.charge || "";

  photo.src = safeSuspect.image || "assets/wanted/placeholder.png";
  photo.alt = safeSuspect.name || `Wanted ${index}`;
  photo.style.objectFit = safeSuspect.photoFit || MOST_WANTED_PHOTO_FIT || "cover";
  photo.style.objectPosition = safeSuspect.photoPosition || MOST_WANTED_PHOTO_POSITION || "center top";
  photo.onerror = function () {
    this.onerror = null;
    this.src = "assets/wanted/placeholder.png";
  };

  name.textContent = safeSuspect.name || "";
  reason.textContent = desc;
}

function renderMostWantedBoard() {
  for (let i = 1; i <= 6; i++) {
    setWantedSlot(i, MOST_WANTED_SUSPECTS[i - 1] || null);
  }
}

function setupMostWantedBoard() {
  const panel = document.getElementById("wantedBoardPanel");
  if (!panel) return false;

  if (!MOST_WANTED_ENABLED) {
    document.body.classList.add("no-mostwanted-layout");
    setPanelVisibility(panel, false);
    return false;
  }

  document.body.classList.remove("no-mostwanted-layout");

  const template = document.querySelector(".wanted-board-template");
  const board = document.getElementById("wantedBoard");
  if (template && board) {
    template.onerror = function () {
      this.style.display = "none";
      board.classList.add("template-missing");
    };
    if (template.complete && template.naturalWidth === 0) {
      template.style.display = "none";
      board.classList.add("template-missing");
    }
  }

  renderMostWantedBoard();
  setPanelVisibility(panel, false);
  return true;
}

function setupGalleryPanel() {
  const panel = document.getElementById("galleryPanel");
  const grid = document.getElementById("galleryGrid");
  if (!panel || !grid) return false;

  grid.innerHTML = "";

  if (!GALLERY_ENABLED) {
    document.body.classList.add("no-gallery-layout");
    setPanelVisibility(panel, false);
    return false;
  }

  document.body.classList.remove("no-gallery-layout");
  document.body.classList.toggle("gallery-captions-hidden", !GALLERY_SHOW_CAPTIONS);
  const photos = getFirstSix(GALLERY_PHOTOS);

  if (!photos.length) {
    grid.appendChild(createFallbackMessage("gallery-empty", "Add up to six gallery photos in GALLERY_PHOTOS inside script.js."));
  } else {
    photos.forEach((photo, index) => {
      const card = document.createElement("div");
      card.className = "gallery-photo-card";

      const imageWrap = document.createElement("div");
      imageWrap.className = "gallery-photo-wrap";

      const img = document.createElement("img");
      img.src = photo.image || "assets/gallery/placeholder.png";
      img.alt = photo.title || `Gallery ${index + 1}`;
      img.style.objectFit = photo.photoFit || GALLERY_PHOTO_FIT || "cover";
      img.style.objectPosition = photo.photoPosition || GALLERY_PHOTO_POSITION || "center center";
      img.onerror = function () {
        this.onerror = null;
        this.src = "assets/gallery/placeholder.png";
      };
      imageWrap.appendChild(img);

      const caption = document.createElement("div");
      caption.className = "gallery-photo-caption";

      const title = document.createElement("div");
      title.className = "gallery-photo-title";
      title.textContent = photo.title || `Gallery ${index + 1}`;

      const description = document.createElement("div");
      description.className = "gallery-photo-desc";
      description.textContent = photo.description || "";

      caption.appendChild(title);
      if (description.textContent) caption.appendChild(description);

      card.appendChild(imageWrap);
      if (GALLERY_SHOW_CAPTIONS) card.appendChild(caption);
      grid.appendChild(card);
    });
  }

  setPanelVisibility(panel, false);
  return true;
}

function getFeaturePanelElement(key) {
  const def = FEATURE_PANEL_DEFINITIONS[key];
  return def ? document.getElementById(def.id) : null;
}

function normalizeFeatureKey(key) {
  const normalized = String(key || "").toLowerCase().replace(/[^a-z]/g, "");
  if (normalized === "mostwanted" || normalized === "wanted") return "mostwanted";
  if (normalized === "staff") return "staff";
  if (normalized === "gallery" || normalized === "photos" || normalized === "pictures") return "gallery";
  return null;
}

function shouldRotateFeaturePanels() {
  return String(FEATURE_PANEL_MODE || "single").toLowerCase() === "rotate";
}

function getEnabledFeatureKeys() {
  const configuredOrder = Array.isArray(FEATURE_ROTATION_ORDER) ? FEATURE_ROTATION_ORDER : ["staff", "mostwanted", "gallery"];
  const seen = new Set();
  const ordered = [];

  configuredOrder.forEach((rawKey) => {
    const key = normalizeFeatureKey(rawKey);
    if (!key || seen.has(key)) return;
    seen.add(key);
    ordered.push(key);
  });

  ["staff", "mostwanted", "gallery"].forEach((key) => {
    if (!seen.has(key)) ordered.push(key);
  });

  return ordered.filter((key) => {
    const def = FEATURE_PANEL_DEFINITIONS[key];
    return def && def.enabled && def.enabled() && getFeaturePanelElement(key);
  });
}

function hideFeaturePanel(key) {
  const def = FEATURE_PANEL_DEFINITIONS[key];
  const panel = getFeaturePanelElement(key);
  if (def && def.onHide) def.onHide();
  setPanelVisibility(panel, false);
}

function showFeaturePanel(key) {
  const normalizedKey = normalizeFeatureKey(key);
  const enabledKeys = getEnabledFeatureKeys();
  const nextKey = enabledKeys.includes(normalizedKey) ? normalizedKey : enabledKeys[0];

  Object.keys(FEATURE_PANEL_DEFINITIONS).forEach((panelKey) => {
    if (panelKey !== nextKey) hideFeaturePanel(panelKey);
  });

  if (!nextKey) {
    activeFeatureKey = null;
    return null;
  }

  const def = FEATURE_PANEL_DEFINITIONS[nextKey];
  const panel = getFeaturePanelElement(nextKey);
  setPanelVisibility(panel, true);
  activeFeatureKey = nextKey;
  if (def && def.onShow) def.onShow();
  return nextKey;
}

function getInitialFeatureKey(enabledKeys) {
  const preferred = normalizeFeatureKey(SINGLE_FEATURE_PANEL);
  if (preferred && enabledKeys.includes(preferred)) return preferred;
  return enabledKeys[0] || null;
}

function startFeatureRotation() {
  stopFeatureRotation();
  if (!shouldRotateFeaturePanels()) return;

  const enabledKeys = getEnabledFeatureKeys();
  if (enabledKeys.length <= 1) return;

  const interval = Math.max(3000, Number(FEATURE_ROTATION_INTERVAL_MS) || 12000);
  featureRotationTimer = setInterval(() => {
    const currentEnabled = getEnabledFeatureKeys();
    if (currentEnabled.length <= 1) return;

    const currentIndex = currentEnabled.indexOf(activeFeatureKey);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % currentEnabled.length : 0;
    showFeaturePanel(currentEnabled[nextIndex]);
  }, interval);
}

function stopFeatureRotation() {
  if (featureRotationTimer) {
    clearInterval(featureRotationTimer);
    featureRotationTimer = null;
  }
}

function setFeaturePanelShellVisible(isVisible) {
  const shell = document.getElementById("featurePanelShell");
  if (!shell) return;

  shell.style.display = isVisible ? "flex" : "none";
  document.body.classList.toggle("no-feature-panel-layout", !isVisible);
}

function setupFeaturePanels() {
  stopFeatureRotation();

  Object.keys(FEATURE_PANEL_DEFINITIONS).forEach((key) => {
    const def = FEATURE_PANEL_DEFINITIONS[key];
    if (def && def.setup) def.setup();
  });

  const enabledKeys = getEnabledFeatureKeys();
  setFeaturePanelShellVisible(enabledKeys.length > 0);

  const initialKey = shouldRotateFeaturePanels() ? enabledKeys[0] : getInitialFeatureKey(enabledKeys);
  showFeaturePanel(initialKey);
  startFeatureRotation();
}

// ===================== LIVE STATS =========================
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(value);
}

function normalizeEndpoint(endpoint) {
  if (!endpoint) return "";
  return endpoint.replace(/\/$/, "");
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  let data = null;

  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    const message = data && data.error ? data.error : `HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function normalizeDiscordInviteCode(value) {
  let invite = String(value || "").trim();
  if (!invite) return "";
  invite = invite.replace(/^https?:\/\/discord\.gg\//i, "");
  invite = invite.replace(/^https?:\/\/discord\.com\/invite\//i, "");
  invite = invite.replace(/^discord\.gg\//i, "");
  invite = invite.replace(/^discord\.com\/invite\//i, "");
  invite = invite.split("?")[0].split("/")[0].trim();
  return invite;
}

function formatCount(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return "--";
  return Math.floor(numeric).toLocaleString();
}

function setDiscordWidgetText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function buildDiscordAssetUrl(guildId, hash, type, size) {
  if (!guildId || !hash) return "";
  const ext = String(hash).startsWith("a_") ? "gif" : "webp";
  return `https://cdn.discordapp.com/${type}/${guildId}/${hash}.${ext}?size=${size || 128}`;
}

function renderDiscordInviteWidget(inviteData) {
  const guild = inviteData && inviteData.guild ? inviteData.guild : {};
  const name = guild.name || inviteData.name || DISCORD_WIDGET_FALLBACK.name || "Discord Server";
  const online = inviteData.approximate_presence_count ?? inviteData.presence_count ?? inviteData.online ?? DISCORD_WIDGET_FALLBACK.online;
  const members = inviteData.approximate_member_count ?? inviteData.member_count ?? inviteData.members ?? DISCORD_WIDGET_FALLBACK.members;
  const description = guild.description || inviteData.description || DISCORD_WIDGET_FALLBACK.description || "";
  const iconUrl = buildDiscordAssetUrl(guild.id, guild.icon, "icons", 128) || "assets/images/logo.png";
  const bannerUrl = buildDiscordAssetUrl(guild.id, guild.banner || guild.splash, guild.banner ? "banners" : "splashes", 640);

  setDiscordWidgetText("discordServerName", name);
  setDiscordWidgetText("discordOnlineCount", formatCount(online));
  setDiscordWidgetText("discordMemberCount", formatCount(members));
  setDiscordWidgetText("discordDescription", description);

  const icon = document.getElementById("discordIcon");
  if (icon) icon.src = iconUrl;

  const banner = document.getElementById("discordBanner");
  if (banner) {
    if (bannerUrl) {
      banner.style.backgroundImage = `url('${bannerUrl}')`;
    } else {
      banner.style.backgroundImage = "";
    }
  }
}

async function updateDiscordInviteWidget() {
  const endpoint = DISCORD_INVITE_WIDGET_ENDPOINT ? DISCORD_INVITE_WIDGET_ENDPOINT.trim() : "";
  const inviteCode = normalizeDiscordInviteCode(DISCORD_INVITE_CODE);

  try {
    if (endpoint) {
      const data = await fetchJson(endpoint);
      renderDiscordInviteWidget(data);
      return;
    }

    if (inviteCode) {
      const data = await fetchJson(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`);
      renderDiscordInviteWidget(data);
      return;
    }
  } catch (e) {
    console.warn("Discord invite widget failed:", e);
  }

  // Keep a clean widget instead of showing the old email count placeholder.
  renderDiscordInviteWidget({});
}

async function updateFiveMStateCount() {
  const endpoint = normalizeEndpoint(FIVEM_SERVER_ENDPOINT);

  try {
    if (endpoint) {
      const players = await fetchJson(`${endpoint}/players.json`);
      if (Array.isArray(players)) {
        setText("stateCount", players.length);
        return;
      }
    }

    if (CFX_SERVER_CODE) {
      const data = await fetchJson(`https://servers-frontend.fivem.net/api/servers/single/${CFX_SERVER_CODE}`);
      const clients = data && data.Data && data.Data.clients;
      if (typeof clients === "number") {
        setText("stateCount", clients);
        return;
      }
    }
  } catch (e) {
    // CORS, wrong endpoint, or offline server. Keep the last displayed value if it fails.
    console.warn("FiveM state count failed:", e);
  }
}

function blankDutyBucket() {
  const bucket = {};
  DUTY_DEPARTMENTS.forEach((dept) => {
    bucket[dept.key] = { label: dept.label, count: 0, names: [] };
  });
  return bucket;
}

function findDepartmentKey(rawName) {
  const text = String(rawName || "").trim().toLowerCase();
  if (!text) return null;

  for (const dept of DUTY_DEPARTMENTS) {
    if (dept.key === text || dept.aliases.some((alias) => text.includes(alias))) {
      return dept.key;
    }
  }
  return null;
}

function isPlayerOnDuty(player) {
  if (!player || typeof player !== "object") return false;
  if (player.onDuty === true || player.onduty === true || player.duty === true || player.isOnDuty === true) return true;
  if (typeof player.status === "string" && player.status.toLowerCase().includes("duty")) return true;
  return false;
}

function addDutyEntry(bucket, deptName, count, names) {
  const key = findDepartmentKey(deptName);
  if (!key) return;

  if (!bucket[key]) {
    bucket[key] = { label: String(deptName || key), count: 0, names: [] };
  }

  const numericCount = Number(count);
  if (!Number.isNaN(numericCount)) bucket[key].count += numericCount;

  if (Array.isArray(names)) {
    names.forEach((name) => {
      if (name) bucket[key].names.push(String(name));
    });
  }
}

function parseDutyPayload(data) {
  const bucket = blankDutyBucket();
  const payload = data.departments || data.duty || data.onDuty || data.counts || data;

  if (Array.isArray(data.players)) {
    data.players.forEach((player) => {
      if (!isPlayerOnDuty(player)) return;
      const dept = player.department || player.dept || player.job || player.jobName || player.role;
      const name = player.name || player.characterName || player.charName || player.playerName;
      addDutyEntry(bucket, dept, 1, name ? [name] : []);
    });
  }

  if (Array.isArray(payload)) {
    payload.forEach((item) => {
      if (typeof item === "string") return;
      const dept = item.department || item.dept || item.job || item.name || item.label || item.key;
      const count = item.count ?? item.total ?? item.onDuty ?? item.players?.length ?? 0;
      const names = item.names || item.players || item.members || [];
      addDutyEntry(bucket, dept, count, names.map((n) => typeof n === "string" ? n : (n.name || n.characterName || n.playerName)).filter(Boolean));
    });
  } else if (payload && typeof payload === "object") {
    Object.entries(payload).forEach(([dept, value]) => {
      if (typeof value === "number") {
        addDutyEntry(bucket, dept, value, []);
      } else if (Array.isArray(value)) {
        addDutyEntry(bucket, dept, value.length, value.map((n) => typeof n === "string" ? n : (n.name || n.characterName || n.playerName)).filter(Boolean));
      } else if (value && typeof value === "object") {
        const count = value.count ?? value.total ?? value.onDuty ?? value.players?.length ?? value.names?.length ?? 0;
        const names = value.names || value.players || value.members || [];
        addDutyEntry(bucket, dept, count, names.map((n) => typeof n === "string" ? n : (n.name || n.characterName || n.playerName)).filter(Boolean));
      }
    });
  }

  return bucket;
}

function getDutyCount(bucket, key) {
  const dept = bucket && bucket[key];
  if (!dept) return 0;

  const numericCount = Number(dept.count);
  if (!Number.isNaN(numericCount) && numericCount > 0) return numericCount;

  return Array.isArray(dept.names) ? dept.names.length : 0;
}

function renderDutyList(bucket) {
  const list = document.getElementById("dutyList");
  if (!list) return;

  // Summary-only view: combine departments instead of showing every department/player name.
  const summaryRows = [
    { label: "LEO", count: getDutyCount(bucket, "lspd") + getDutyCount(bucket, "bcso") + getDutyCount(bucket, "sasp") },
    { label: "FIRE", count: getDutyCount(bucket, "fire") },
    { label: "EMS", count: getDutyCount(bucket, "ems") }
  ];

  list.innerHTML = "";

  summaryRows.forEach((dept) => {
    const row = document.createElement("div");
    row.className = "duty-row duty-summary-row";

    const name = document.createElement("div");
    name.className = "duty-name";
    name.textContent = dept.label;

    const count = document.createElement("div");
    count.className = "duty-count";
    count.textContent = dept.count;

    row.appendChild(name);
    row.appendChild(count);
    list.appendChild(row);
  });
}

function handleDutyStatsMessage(data) {
  renderDutyList(parseDutyPayload(data));
}

function getPoliceEMSActivityDutyStatsUrls() {
  if (POLICE_EMS_ACTIVITY_DUTY_ENDPOINT) return [POLICE_EMS_ACTIVITY_DUTY_ENDPOINT];

  const endpoint = normalizeEndpoint(FIVEM_SERVER_ENDPOINT);
  if (!endpoint) return [];

  const resourceName = String(POLICE_EMS_ACTIVITY_RESOURCE_NAME || "PoliceEMSActivity")
    .replace(/^\/+|\/+$/g, "");

  return [
    `${endpoint}/${resourceName}/policeemsactivity-duty.json`,
    `${endpoint}/${resourceName}/duty.json`
  ];
}

async function updatePoliceEMSActivityDutyStats() {
  const urls = getPoliceEMSActivityDutyStatsUrls();
  if (!urls.length) return;

  let lastError = null;
  for (const url of urls) {
    try {
      const data = await fetchJson(url);
      handleDutyStatsMessage(data);
      return;
    } catch (e) {
      lastError = e;
    }
  }

  // Keep the empty/last list if PoliceEMSActivity is not available yet.
  console.warn("PoliceEMSActivity duty stats failed:", lastError);
}

async function updateStats() {
  await Promise.allSettled([
    updateDiscordInviteWidget(),
    updateFiveMStateCount()
  ]);
}

function setupStatsRefresh() {
  renderDutyList(blankDutyBucket());
  updateStats();
  setInterval(updateStats, STATS_REFRESH_MS);

  // Duty data comes only from PoliceEMSActivity. It is not tracked by this loading screen.
  updatePoliceEMSActivityDutyStats();
  setInterval(updatePoliceEMSActivityDutyStats, POLICE_EMS_ACTIVITY_DUTY_REFRESH_MS);
}

// ===================== AUDIO CONTROL =========================
function getAudioTracks() {
  return Array.isArray(AUDIO_TRACKS) ? AUDIO_TRACKS.filter(Boolean) : [];
}

function clampAudioVolume(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

function getAudioTrackName(track) {
  if (!track) return "No track selected";
  const fileName = String(track).split("/").pop().split("?")[0] || String(track);
  const decoded = decodeURIComponent(fileName).replace(/\.[a-z0-9]+$/i, "");
  return decoded.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim() || fileName;
}

function getMusicWidgetElements() {
  return {
    widget: document.getElementById("musicPlayerWidget"),
    trackName: document.getElementById("musicTrackName"),
    prevBtn: document.getElementById("musicPrevBtn"),
    playPauseBtn: document.getElementById("musicPlayPauseBtn"),
    nextBtn: document.getElementById("musicNextBtn"),
    volumeSlider: document.getElementById("musicVolumeSlider"),
    volumeText: document.getElementById("musicVolumeText")
  };
}

function setMusicWidgetVisible(isVisible) {
  const { widget } = getMusicWidgetElements();
  if (widget) widget.style.display = isVisible ? "block" : "none";
}

function updateMusicPlayerUI() {
  const tracks = getAudioTracks();
  const els = getMusicWidgetElements();
  const hasMusic = AUDIO_ENABLED && tracks.length > 0;

  if (els.widget) {
    els.widget.style.display = MUSIC_PLAYER_WIDGET_ENABLED && hasMusic ? "block" : "none";
  }

  if (els.trackName) {
    const currentTrack = tracks[audioTrackIndex] || tracks[0] || "";
    els.trackName.textContent = MUSIC_PLAYER_SHOW_TRACK_NAME ? getAudioTrackName(currentTrack) : "Background Music";
  }

  const volumePercent = Math.round(clampAudioVolume(audioVolume) * 100);
  if (els.volumeSlider) els.volumeSlider.value = String(volumePercent);
  if (els.volumeText) els.volumeText.textContent = `${volumePercent}%`;

  const isPaused = !bgAudioElement || bgAudioElement.paused;
  if (els.playPauseBtn) {
    els.playPauseBtn.textContent = isPaused ? "▶" : "⏸";
    els.playPauseBtn.setAttribute("aria-label", isPaused ? "Play music" : "Pause music");
  }
}

function loadAudioTrack(index, shouldPlay = true) {
  const tracks = getAudioTracks();
  if (!bgAudioElement || !tracks.length) return;

  const nextIndex = ((Number(index) || 0) % tracks.length + tracks.length) % tracks.length;
  audioTrackIndex = nextIndex;

  const track = tracks[audioTrackIndex];
  bgAudioElement.src = track;
  bgAudioElement.currentTime = 0;
  bgAudioElement.loop = false;

  try {
    bgAudioElement.volume = clampAudioVolume(audioVolume);
  } catch (e) {}

  updateMusicPlayerUI();

  if (shouldPlay) {
    const playPromise = bgAudioElement.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function() {
        // Autoplay can be blocked until the player clicks the music button.
        updateMusicPlayerUI();
      });
    }
  }
}

function pickRandomTrack() {
  const tracks = getAudioTracks();
  if (!tracks.length) return null;
  const index = Math.floor(Math.random() * tracks.length);
  return tracks[index];
}

function pickInitialAudioTrackIndex() {
  const tracks = getAudioTracks();
  if (!tracks.length) return 0;
  if (!MUSIC_PLAYER_RANDOM_FIRST_TRACK) return 0;
  return Math.floor(Math.random() * tracks.length);
}

function startRandomTrack() {
  if (!bgAudioElement) return;
  const tracks = getAudioTracks();
  if (!tracks.length) return;
  loadAudioTrack(pickInitialAudioTrackIndex(), true);
}

function playNextAudioTrack() {
  const tracks = getAudioTracks();
  if (!tracks.length) return;
  loadAudioTrack(audioTrackIndex + 1, true);
}

function playPreviousAudioTrack() {
  const tracks = getAudioTracks();
  if (!tracks.length || !bgAudioElement) return;

  // If the current song has been playing for a few seconds, restart it first.
  // Otherwise go back to the previous song.
  if (bgAudioElement.currentTime > 3) {
    bgAudioElement.currentTime = 0;
    updateMusicPlayerUI();
    return;
  }

  loadAudioTrack(audioTrackIndex - 1, true);
}

function setAudioVolume(value) {
  if (!bgAudioElement) return;
  audioVolume = clampAudioVolume(value);
  try {
    bgAudioElement.volume = audioVolume;
  } catch (e) {}
  updateMusicPlayerUI();
}

function setupBackgroundAudio() {
  if (!AUDIO_ENABLED) {
    setMusicWidgetVisible(false);
    return;
  }

  bgAudioElement = document.getElementById("bgAudio");
  if (!bgAudioElement) return;

  audioVolume = clampAudioVolume(audioDefaultVolume);
  try {
    bgAudioElement.volume = audioVolume;
  } catch (e) {}

  bgAudioElement.addEventListener("ended", function() {
    playNextAudioTrack();
  });

  bgAudioElement.addEventListener("play", updateMusicPlayerUI);
  bgAudioElement.addEventListener("pause", updateMusicPlayerUI);
  bgAudioElement.addEventListener("volumechange", updateMusicPlayerUI);
  bgAudioElement.addEventListener("loadedmetadata", updateMusicPlayerUI);

  startRandomTrack();
  updateMusicPlayerUI();
}

function changeAudioVolume(delta) {
  setAudioVolume(clampAudioVolume(audioVolume) + delta);
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
  updateMusicPlayerUI();
}

function setupMusicPlayerWidget() {
  const tracks = getAudioTracks();
  const els = getMusicWidgetElements();

  if (!MUSIC_PLAYER_WIDGET_ENABLED || !AUDIO_ENABLED || !tracks.length || !els.widget) {
    setMusicWidgetVisible(false);
    return;
  }

  setMusicWidgetVisible(true);

  if (els.prevBtn) {
    els.prevBtn.addEventListener("click", function(e) {
      e.preventDefault();
      playPreviousAudioTrack();
    });
  }

  if (els.playPauseBtn) {
    els.playPauseBtn.addEventListener("click", function(e) {
      e.preventDefault();
      toggleAudioPause();
    });
  }

  if (els.nextBtn) {
    els.nextBtn.addEventListener("click", function(e) {
      e.preventDefault();
      playNextAudioTrack();
    });
  }

  if (els.volumeSlider) {
    els.volumeSlider.addEventListener("input", function(e) {
      const percent = Number(e.target.value) || 0;
      setAudioVolume(percent / 100);
    });
  }

  updateMusicPlayerUI();
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
    // Left arrow: previous/restart song
    else if (key === "ArrowLeft" || key === "Left" || kc === 37) {
      e.preventDefault();
      playPreviousAudioTrack();
    }
    // Right arrow: next song
    else if (key === "ArrowRight" || key === "Right" || kc === 39) {
      e.preventDefault();
      playNextAudioTrack();
    }
  });
}

function clampLoadingFraction(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(1, numeric));
}

function setRealLoadingProgress(loadFraction) {
  if (!REAL_LOAD_PROGRESS_ENABLED) return;

  const fraction = clampLoadingFraction(loadFraction);
  const percent = Math.round(fraction * 100);
  const bar = document.getElementById("loadingProgressBar");
  const text = document.getElementById("loadingProgressText");
  const container = document.getElementById("loadingProgressContainer");

  if (bar) {
    bar.style.transition = REAL_LOAD_PROGRESS_SMOOTHING ? "width 0.35s ease" : "none";
    bar.style.width = percent + "%";
  }

  if (text) {
    text.style.display = REAL_LOAD_PROGRESS_SHOW_PERCENT ? "inline" : "none";
    text.textContent = percent + "%";
  }

  if (container) {
    container.setAttribute("aria-valuenow", String(percent));
  }
}

function handleFiveMLoadProgressMessage(data) {
  if (!data) return false;
  const isLoadProgress = data.eventName === "loadProgress" || data.type === "loadProgress";
  if (!isLoadProgress) return false;
  setRealLoadingProgress(data.loadFraction);
  return true;
}

window.addEventListener("message", function (event) {
  var data = event.data;
  if (!data || typeof data !== "object") return;

  if (handleFiveMLoadProgressMessage(data)) {
    return;
  }

  if (data["x-tiktok-player"]) {
    handleTikTokPlayerMessage(data);
    return;
  }

  if (data.type === "dutyStats") {
    handleDutyStatsMessage(data);
  }
});


document.addEventListener("DOMContentLoaded", () => {
  applyFeaturePanelSizingConfig();
  setupBackgroundYouTube();
  const phoneTikTokEnabled = setupPhoneTikTokPanel();
  setupFeaturePanels();

  updateVolumeReadout();
  if (phoneTikTokEnabled) {
    setupVolumeKeys();
    loadRandomShort();
  }

  setupBackgroundAudio();
  setupMusicPlayerWidget();
  setupAudioKeys();
  setupStatsRefresh();
});

