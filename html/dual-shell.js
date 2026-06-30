(() => {
  'use strict';

  const STORAGE_KEY = 'gsrp:last-loading-design';
  const DESIGN_IDS = ['twopoint', 'graveyard'];
  const LABELS = { twopoint: 'Design 1', graveyard: 'Design 2' };
  const frames = {
    twopoint: document.getElementById('designTwopoint'),
    graveyard: document.getElementById('designGraveyard')
  };
  const label = document.getElementById('activeDesignLabel');
  const switchBtn = document.getElementById('designSwitch');
  const audio = document.getElementById('sharedAudio');
  const trackTitle = document.getElementById('sharedTrackTitle');
  const playPause = document.getElementById('sharedPlayPause');
  const prevBtn = document.getElementById('sharedPrev');
  const nextBtn = document.getElementById('sharedNext');
  const volumeSlider = document.getElementById('sharedVolume');
  const volumeText = document.getElementById('sharedVolumeText');
  const musicWidget = document.getElementById('sharedMusicWidget');

  const shared = window.SharedLoadscreenConfig || {};
  const music = shared.music || {};
  const playlist = Array.isArray(music.playlist) ? music.playlist.filter((item) => item && item.file) : [];
  let activeDesign = safeStoredDesign();
  let trackIndex = 0;
  let latestProgressMessage = null;
  let sharedProgress = 0;
  let receivedRealProgress = false;
  let musicStarted = false;

  function safeStoredDesign() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (DESIGN_IDS.includes(stored)) return stored;
    } catch (_) {}
    return 'twopoint';
  }

  function rememberDesign(id) {
    try { localStorage.setItem(STORAGE_KEY, id); } catch (_) {}
  }

  function setActiveDesign(id) {
    const next = DESIGN_IDS.includes(id) ? id : 'twopoint';
    activeDesign = next;
    try { document.body.setAttribute('data-active-design', next); } catch (_) {}
    Object.entries(frames).forEach(([key, frame]) => {
      if (!frame) return;
      frame.classList.toggle('is-active', key === next);
      frame.setAttribute('aria-hidden', key === next ? 'false' : 'true');
    });
    if (label) label.textContent = LABELS[next] || next;
    rememberDesign(next);
    sendLatestProgressToFrames();
  }

  function toggleDesign() {
    const currentIndex = DESIGN_IDS.indexOf(activeDesign);
    setActiveDesign(DESIGN_IDS[(currentIndex + 1) % DESIGN_IDS.length]);
  }

  function postToFrame(frame, data) {
    if (!frame || !frame.contentWindow || !data) return;
    try { frame.contentWindow.postMessage(data, '*'); } catch (_) {}
  }

  function sendLatestProgressToFrames() {
    if (!latestProgressMessage) return;
    Object.values(frames).forEach((frame) => postToFrame(frame, latestProgressMessage));
  }

  function forwardMessageToDesigns(data) {
    Object.values(frames).forEach((frame) => postToFrame(frame, data));
  }

  function normalizeProgressValue(value) {
    let fraction = Number(value);
    if (!Number.isFinite(fraction)) return null;
    if (fraction > 1) fraction = fraction / 100;
    return clamp(fraction, 0, 1);
  }

  function getProgressFraction(data) {
    if (!data || typeof data !== 'object') return null;
    if (typeof data.loadFraction === 'number') return normalizeProgressValue(data.loadFraction);
    if (typeof data.progress === 'number') return normalizeProgressValue(data.progress);
    return null;
  }

  function sendSharedProgress(fraction, realProgress) {
    const normalized = normalizeProgressValue(fraction);
    if (normalized === null) return;

    if (realProgress) receivedRealProgress = true;
    // Keep both designs perfectly in sync and avoid visual jumps backwards.
    sharedProgress = Math.max(sharedProgress, normalized);

    latestProgressMessage = {
      eventName: 'loadProgress',
      type: 'loadProgress',
      loadFraction: sharedProgress,
      progress: sharedProgress,
      percent: Math.round(sharedProgress * 100)
    };

    forwardMessageToDesigns(latestProgressMessage);
  }

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    const progressFraction = getProgressFraction(data);
    const looksLikeProgress = data.eventName === 'loadProgress' || data.type === 'loadProgress' || progressFraction !== null;

    if (looksLikeProgress && progressFraction !== null) {
      sendSharedProgress(progressFraction, true);
      return;
    }

    // Forward FiveM load messages/stats to both already-loaded designs so switching never resets the bar.
    forwardMessageToDesigns(data);
  });

  function startSharedFallbackProgress() {
    setInterval(() => {
      if (receivedRealProgress) return;
      if (sharedProgress >= 0.92) return;
      const bump = sharedProgress < 0.60 ? 0.008 : 0.003;
      sendSharedProgress(sharedProgress + bump, false);
    }, 400);
  }

  Object.values(frames).forEach((frame) => {
    if (!frame) return;
    frame.addEventListener('load', sendLatestProgressToFrames);
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function updateMusicUi() {
    if (!playlist.length || !audio) {
      if (musicWidget) musicWidget.style.display = 'none';
      return;
    }
    if (musicWidget) musicWidget.style.display = music.enabled === false ? 'none' : 'flex';
    const track = playlist[trackIndex] || playlist[0];
    if (trackTitle) trackTitle.textContent = track.title || (track.file || '').split('/').pop() || 'Music';
    if (playPause) playPause.textContent = audio.paused ? '▶' : '⏸';
    const pct = Math.round((Number(audio.volume) || 0) * 100);
    if (volumeSlider) volumeSlider.value = String(pct);
    if (volumeText) volumeText.textContent = `${pct}%`;
  }

  async function tryPlay() {
    if (!audio || music.enabled === false || !playlist.length) return;
    try {
      await audio.play();
      musicStarted = true;
    } catch (_) {
      // CEF/browser may require the player's first click. The next click tries again.
    }
    updateMusicUi();
  }

  function setTrack(index, shouldPlay) {
    if (!audio || !playlist.length) return;
    trackIndex = ((index % playlist.length) + playlist.length) % playlist.length;
    const track = playlist[trackIndex];
    const wasPlaying = !audio.paused;
    audio.src = track.file;
    audio.currentTime = 0;
    updateMusicUi();
    if (shouldPlay || wasPlaying) tryPlay();
  }

  function nextTrack() { setTrack(trackIndex + 1, true); }
  function prevTrack() {
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    setTrack(trackIndex - 1, true);
  }

  function initMusic() {
    if (!audio || music.enabled === false || !playlist.length) {
      if (musicWidget) musicWidget.style.display = 'none';
      return;
    }

    const initialVolume = clamp(Number(music.volume), 0, 1);
    audio.volume = Number.isFinite(initialVolume) ? initialVolume : 0.12;
    trackIndex = music.shuffle && playlist.length > 1 ? Math.floor(Math.random() * playlist.length) : 0;
    setTrack(trackIndex, false);

    audio.addEventListener('play', updateMusicUi);
    audio.addEventListener('pause', updateMusicUi);
    audio.addEventListener('volumechange', updateMusicUi);
    audio.addEventListener('ended', () => {
      if (music.loopPlaylist === false && trackIndex === playlist.length - 1) return;
      nextTrack();
    });

    if (playPause) {
      playPause.addEventListener('click', () => {
        if (audio.paused) tryPlay();
        else audio.pause();
        updateMusicUi();
      });
    }
    if (prevBtn) prevBtn.addEventListener('click', prevTrack);
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);
    if (volumeSlider) {
      volumeSlider.addEventListener('input', () => {
        audio.volume = clamp(Number(volumeSlider.value) / 100, 0, 1);
        updateMusicUi();
      });
    }

    window.addEventListener('click', () => {
      if (!musicStarted && audio.paused) tryPlay();
    }, { once: true });

    if (music.autoplay !== false) tryPlay();
    updateMusicUi();
  }

  if (switchBtn) switchBtn.addEventListener('click', toggleDesign);
  document.addEventListener('keydown', (event) => {
    // F9 is an optional quick switch. Button remains the main control.
    if (event.key === 'F9') {
      event.preventDefault();
      toggleDesign();
    }
  });

  setActiveDesign(activeDesign);
  startSharedFallbackProgress();
  initMusic();
})();
