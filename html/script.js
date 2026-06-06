// Loading screen logic for shorts + staff + tips

// ===================== CONFIG =========================

// ===== STATS CONFIG =====

// Discord invite code used to draw the widget-style card.
// Put only the invite code, not the full URL.
// Examples:
//   discord.gg/abc123 -> "abc123"
//   discord.com/invite/abc123 -> "abc123"
var DISCORD_INVITE_CODE = "TeCxSpC5wf";

// Optional custom endpoint/proxy for the invite widget JSON. Leave blank for direct Discord invite API.
// Direct mode uses: https://discord.com/api/v10/invites/YOUR_CODE?with_counts=true
var DISCORD_INVITE_WIDGET_ENDPOINT = "";

// Optional manual fallback while setting up the invite code.
// Leave null for automatic tracking.
var DISCORD_WIDGET_FALLBACK = {
  name: "Discord Server",
  online: null,
  members: null,
  description: "Set DISCORD_INVITE_CODE in script.js to show the Discord widget."
};

// FiveM server HTTP endpoint (for players.json & info.json).
// This drives the "people in the state" count.
var FIVEM_SERVER_ENDPOINT = "http://15.204.91.117:30120";

// Optional: your cfx.re join code. Example: if your join link is cfx.re/join/abc123, set this to "abc123".
// This is used as a fallback when FIVEM_SERVER_ENDPOINT is blank.
var CFX_SERVER_CODE = "3pxp7z";

// PoliceEMSActivity resource folder name. This must match the folder name used in resources/.
// If your folder is renamed, update this value or set POLICE_EMS_ACTIVITY_DUTY_ENDPOINT below.
var POLICE_EMS_ACTIVITY_RESOURCE_NAME = "PoliceEMSActivity";

// Optional full PoliceEMSActivity duty JSON endpoint. Leave blank to auto-use:
// FIVEM_SERVER_ENDPOINT + /POLICE_EMS_ACTIVITY_RESOURCE_NAME/policeemsactivity-duty.json
// This endpoint is provided by the patched PoliceEMSActivity resource, not this loading screen.
var POLICE_EMS_ACTIVITY_DUTY_ENDPOINT = "";

// How often to refresh PoliceEMSActivity duty stats (5 minutes, in milliseconds).
var POLICE_EMS_ACTIVITY_DUTY_REFRESH_MS = 300000;

// Departments to display in the on-duty box. These match your PoliceEMSActivity Config.RoleList.
const DUTY_DEPARTMENTS = [
  { key: "lspd", label: "👮 LSPD", aliases: ["lspd", "los santos police", "police"], color: 57 },
  { key: "bcso", label: "👮 BCSO", aliases: ["bcso", "sheriff", "blaine county"], color: 52 },
  { key: "sasp", label: "👮 SASP", aliases: ["sasp", "state", "state police", "highway patrol", "trooper"], color: 54 },
  { key: "fire", label: "👨‍🚒 Fire", aliases: ["fire", "fd", "safr", "firefighter"], color: 1 },
  { key: "ems", label: "🚑 EMS", aliases: ["ems", "ambulance", "medical", "medic"], color: 63 }
];

// How often to refresh Discord widget + server stats (5 minutes, in milliseconds)
var STATS_REFRESH_MS = 300000;


// ===== BACKGROUND AUDIO (LOCAL MP3) =====
const AUDIO_ENABLED = true;          // master toggle for background music
let audioDefaultVolume = 0.12;        // 20% starting volume
let audioVolume = audioDefaultVolume;
let bgAudioElement = null;

// List of audio files to pick from (relative to html/)
// Drop multiple .mp3/.ogg files into html/audio and list them here.
const AUDIO_TRACKS = [
"audio/taylorjames.mp3",
"audio/GSRP2.mp3",
"audio/GSRP.mp3",
"audio/Bradshaw.mp3",
"audio/BillyBobandRianontheRun.mp3",
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
   "https://www.tiktok.com/@graveyard_shift_rp/video/7554841913027792183",
  "https://www.tiktok.com/@graveyard_shift_rp/video/7552955657746418957",
  "https://www.tiktok.com/@graveyard_shift_rp/video/7550377797995302158",
  "https://www.tiktok.com/@graveyard_shift_rp/video/7549433613318769975",
  "https://www.tiktok.com/@graveyard_shift_rp/video/7544468486249024823",
  "https://www.tiktok.com/@graveyard_shift_rp/video/7544411266853489933",
  "https://www.tiktok.com/@graveyard_shift_rp/video/7515204589436767534",
  "https://www.tiktok.com/@graveyard_shift_rp/video/7541007316179602743"
];


// ===== BACKGROUND VIDEO (OPTIONAL YOUTUBE) =====
// If enabled and at least one URL is provided, a fullscreen YouTube
// video will play softly behind the loading screen.
// Use regular **watch** URLs here (not Shorts).
const BACKGROUND_VIDEO_ENABLED = false; // background disabled to avoid YouTube error 153

const BACKGROUND_YT_URLS = [
  "https://www.youtube.com/watch?v=gQuAaHQrl8U&list=RDgQuAaHQrl8U&start_radio=1"
];


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

  if (!url) {
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
  const iconUrl = buildDiscordAssetUrl(guild.id, guild.icon, "icons", 128) || "logo.png";
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

function renderDutyList(bucket) {
  const list = document.getElementById("dutyList");
  if (!list) return;

  const rows = DUTY_DEPARTMENTS.map((dept) => bucket[dept.key]).filter((dept) => dept && (dept.count > 0 || dept.names.length > 0));
  list.innerHTML = "";

  if (!rows.length) {
    const empty = document.createElement("div");
    empty.className = "duty-empty";
    empty.textContent = "No on-duty units reported yet.";
    list.appendChild(empty);
    return;
  }

  rows.forEach((dept) => {
    const row = document.createElement("div");
    row.className = "duty-row";

    const name = document.createElement("div");
    name.className = "duty-name";
    name.textContent = dept.label;

    const count = document.createElement("div");
    count.className = "duty-count";
    count.textContent = dept.count;

    row.appendChild(name);
    row.appendChild(count);
    list.appendChild(row);

    if (dept.names.length) {
      const names = document.createElement("div");
      names.className = "duty-names";
      names.textContent = dept.names.join(", ");
      list.appendChild(names);
    }
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

  if (data["x-tiktok-player"]) {
    handleTikTokPlayerMessage(data);
    return;
  }

  if (data.type === "dutyStats") {
    handleDutyStatsMessage(data);
  }
});


document.addEventListener("DOMContentLoaded", () => {
  updateVolumeReadout();
  setupVolumeKeys();
  setupBackgroundAudio();
  setupAudioKeys();
  setupStatsRefresh();
  loadRandomShort();
});

