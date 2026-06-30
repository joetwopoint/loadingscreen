(() => {
  'use strict';

  const cfg = window.LoadscreenConfig || {};
  const $ = (id) => document.getElementById(id);

  const state = {
    progress: 0,
    receivedRealProgress: false,
    trackIndex: 0,
    musicStarted: false,
    statsEndpoint: null
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function asUrl(path) {
    if (!path) return '';
    if (/^(https?:|nui:|cfx-nui:|file:)/i.test(path)) return path;
    return path.replace(/^\.\//, '');
  }

  function setBackground() {
    const bg = cfg.background || {};
    if (bg.image) document.documentElement.style.setProperty('--background-image', `url('${asUrl(bg.image)}')`);
    if (typeof bg.overlayOpacity === 'number') document.documentElement.style.setProperty('--bg-overlay', String(bg.overlayOpacity));
  }

  function fitViewport() {
    const layout = cfg.layout || {};
    const baseWidth = Number(layout.baseWidth) || 1600;
    const baseHeight = Number(layout.baseHeight) || 900;
    const scale = Math.min(window.innerWidth / baseWidth, window.innerHeight / baseHeight);
    const x = Math.max(0, (window.innerWidth - baseWidth * scale) / 2);
    const y = Math.max(0, (window.innerHeight - baseHeight * scale) / 2);

    document.documentElement.style.setProperty('--fit-scale', String(scale));
    document.documentElement.style.setProperty('--fit-x', `${x}px`);
    document.documentElement.style.setProperty('--fit-y', `${y}px`);
  }

  function isPreviewMode() {
    try {
      return new URLSearchParams(window.location.search).has('preview');
    } catch (_) {
      return false;
    }
  }

  function applyPreviewState() {
    if (!isPreviewMode()) return;
    if (cfg.previewStats) updateStatsUi(cfg.previewStats);
    if (typeof cfg.previewProgress === 'number') setProgress(cfg.previewProgress, true);
    const sub = $('loadingSub');
    if (sub) sub.textContent = 'Preview mode - live counts update in FiveM';
  }

  function applyText() {
    const text = cfg.text || {};
    document.querySelectorAll('[data-text]').forEach((node) => {
      const key = node.getAttribute('data-text');
      if (text[key] !== undefined) node.textContent = text[key];
    });

    const loadingLabel = $('loadingLabel');
    const loadingSub = $('loadingSub');
    if (loadingLabel && text.loadingLabel) loadingLabel.textContent = text.loadingLabel;
    if (loadingSub && text.loadingSub) loadingSub.textContent = text.loadingSub;
  }

  function create(tagName = 'div', className = '') {
    const el = document.createElement(tagName);
    el.className = className;
    return el;
  }

  function renderStaff() {
    const grid = $('staffGrid');
    if (!grid) return;
    grid.innerHTML = '';
    (cfg.staff || []).slice(0, 6).forEach((person) => {
      const card = create('div', 'card staff-card');
      const image = create('div', 'staff-image');
      image.style.backgroundImage = `url('${asUrl(person.image || 'assets/images/logo.png')}')`;
      if (person.imageFit) image.style.backgroundSize = person.imageFit;
      if (person.imagePosition) image.style.backgroundPosition = person.imagePosition;

      const text = create('div', 'staff-text');
      const name = create('div', 'staff-name');
      name.textContent = person.name || 'Staff Member';
      const role = create('div', `staff-role ${person.accent || ''}`);
      role.innerHTML = `<span class="role-icon">${person.icon || '◆'}</span><span>${person.role || ''}</span>`;
      text.append(name, role);
      card.append(image, text);
      grid.appendChild(card);
    });
  }

  function renderWanted() {
    const grid = $('wantedGrid');
    if (!grid) return;
    grid.innerHTML = '';
    (cfg.wanted || []).slice(0, 6).forEach((item) => {
      const card = create('div', 'card wanted-card');
      const imageWrap = create('div', 'wanted-image-wrap');
      const image = create('div', 'wanted-image');
      image.style.backgroundImage = `url('${asUrl(item.image || 'assets/images/wanted-placeholder.jpg')}')`;
      if (item.imageFit) image.style.backgroundSize = item.imageFit;
      if (item.imagePosition) image.style.backgroundPosition = item.imagePosition;
      imageWrap.appendChild(image);

      const text = create('div', 'wanted-text');
      const name = create('div', 'wanted-name');
      name.textContent = item.name || 'Unknown Suspect';
      const charge = create('div', 'wanted-charge');
      charge.textContent = item.charge || 'Wanted';
      text.append(name, charge);
      card.append(imageWrap, text);
      grid.appendChild(card);
    });
  }

  function renderGallery() {
    const grid = $('galleryGrid');
    if (!grid) return;
    grid.innerHTML = '';
    (cfg.gallery || []).slice(0, 6).forEach((item) => {
      const card = create('div', 'card gallery-card');
      const image = create('div', 'gallery-image');
      image.style.backgroundImage = `url('${asUrl(item.image || 'assets/images/logo.png')}')`;
      if (item.imageFit) image.style.backgroundSize = item.imageFit;
      if (item.imagePosition) image.style.backgroundPosition = item.imagePosition;
      if (item.imageFit) image.style.backgroundSize = item.imageFit;
      if (item.imagePosition) image.style.backgroundPosition = item.imagePosition;
      const cap = create('div', 'gallery-caption');
      const icon = create('span', 'gallery-icon');
      icon.textContent = item.icon || '📷';
      const name = create('div', 'gallery-name');
      name.textContent = item.name || 'Gallery';
      cap.append(icon, name);
      card.append(image, cap);
      grid.appendChild(card);
    });
  }

  function setProgress(raw, real = false) {
    let fraction = Number(raw);
    if (!Number.isFinite(fraction)) return;
    if (fraction > 1) fraction = fraction / 100;
    fraction = clamp(fraction, 0, 1);

    if (real) state.receivedRealProgress = true;
    // Loading can sometimes send tiny repeated fractions; never make the visual bar jump backward.
    state.progress = Math.max(state.progress, fraction);

    const pct = Math.round(state.progress * 100);
    const fill = $('progressFill');
    const text = $('progressText');
    if (fill) fill.style.width = `${pct}%`;
    if (text) text.textContent = `${pct}%`;
  }

  function handleLoadMessage(event) {
    const data = event.data || {};

    if (data.eventName === 'loadProgress' && typeof data.loadFraction === 'number') {
      setProgress(data.loadFraction, true);
      return;
    }

    if (typeof data.loadFraction === 'number') setProgress(data.loadFraction, true);
    if (typeof data.progress === 'number') setProgress(data.progress, true);

    if (data.eventName === 'onLogLine' && data.message && $('loadingSub')) {
      $('loadingSub').textContent = String(data.message).replace(/\^\d/g, '').slice(0, 110);
    }

    if (data.eventName === 'initFunctionInvoking' && data.name && $('loadingSub')) {
      $('loadingSub').textContent = `Starting ${data.name}`;
    }
  }

  function startFallbackProgress() {
    setInterval(() => {
      if (state.receivedRealProgress) return;
      if (state.progress >= 0.92) return;
      const bump = state.progress < 0.60 ? 0.008 : 0.003;
      setProgress(state.progress + bump, false);
    }, 400);
  }

  function normalizeEndpoint(endpoint) {
    if (!endpoint || typeof endpoint !== 'string') return null;
    let clean = endpoint.trim();
    if (!clean) return null;
    clean = clean.replace(/\/$/, '');
    if (/^https?:\/\//i.test(clean)) return clean;
    clean = clean.replace(/^cfx:\/\//i, '');
    clean = clean.replace(/^\/+/, '');
    if (!clean || clean.includes('undefined')) return null;
    return `http://${clean}`;
  }

  function collectServerRoots() {
    const handover = window.nuiHandoverData || {};
    const roots = [];

    const maybeAdd = (value) => {
      if (!value) return;
      if (Array.isArray(value)) {
        value.forEach(maybeAdd);
      } else if (typeof value === 'object') {
        Object.values(value).forEach(maybeAdd);
      } else if (typeof value === 'string') {
        const normalized = normalizeEndpoint(value);
        if (normalized && !roots.includes(normalized)) roots.push(normalized);
      }
    };

    maybeAdd(handover.connectEndPoints);
    maybeAdd(handover.connectEndpoints);
    maybeAdd(handover.serverAddress);
    maybeAdd(handover.serverEndpoint);
    maybeAdd(handover.endpoint);

    try {
      if (typeof window.invokeNative === 'function') {
        maybeAdd(window.invokeNative('getCurrentServerEndpoint'));
      }
    } catch (_) {}

    maybeAdd(cfg.fallbackServerEndpoint);
    return roots;
  }

  function buildStatsCandidates() {
    if (cfg.statsEndpoint && cfg.statsEndpoint !== 'auto') {
      return [cfg.statsEndpoint];
    }

    const resourceName = cfg.resourceName || 'graveyard_loadscreen';
    const candidates = [];
    collectServerRoots().forEach((root) => {
      [
        `${root}/${resourceName}/stats.json`,
        `${root}/graveyard_loadscreen/stats.json`,
        `${root}/graveyard-loadscreen/stats.json`,
        `${root}/stats.json`
      ].forEach((url) => {
        if (!candidates.includes(url)) candidates.push(url);
      });
    });
    return candidates;
  }

  function normalizeDuty(stats) {
    const duty = stats && stats.duty ? stats.duty : {};
    const totals = { leo: 0, fire: 0, ems: 0 };

    ['leo', 'fire', 'ems'].forEach((key) => {
      if (duty[key] && Number.isFinite(Number(duty[key].count))) {
        totals[key] = Number(duty[key].count);
      }
    });

    // Backward compatibility: if only individual departments are returned, aggregate by label.
    if ((totals.leo + totals.fire + totals.ems) === 0 && Array.isArray(duty.departments)) {
      duty.departments.forEach((dept) => {
        const label = String(dept.label || '').toLowerCase();
        const count = Number(dept.count) || 0;
        if (/fire|fd|rescue|safr/.test(label)) totals.fire += count;
        else if (/ems|medical|ambulance|paramedic|medic/.test(label)) totals.ems += count;
        else totals.leo += count;
      });
    }

    return totals;
  }

  function updateStatsUi(stats) {
    const players = stats && stats.players ? stats.players : {};
    if ($('playerCount') && Number.isFinite(Number(players.online))) $('playerCount').textContent = Number(players.online);
    if ($('playerMax') && Number.isFinite(Number(players.max))) $('playerMax').textContent = Number(players.max);

    const labels = cfg.emergencyLabels || {};
    const totals = normalizeDuty(stats);

    const dutyList = $('dutyList');
    if (dutyList) {
      dutyList.innerHTML = `
        <span><em>${labels.leo || 'LEO'}</em><b id="leoCount">${totals.leo}</b></span>
        <span><em>${labels.fire || 'Fire'}</em><b id="fireCount">${totals.fire}</b></span>
        <span><em>${labels.ems || 'EMS'}</em><b id="emsCount">${totals.ems}</b></span>
      `;
    }
  }

  async function fetchStatsOnce() {
    const candidates = state.statsEndpoint ? [state.statsEndpoint] : buildStatsCandidates();
    if (!candidates.length) return;

    for (const url of candidates) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) continue;
        const json = await res.json();
        if (!json || json.ok === false) continue;
        state.statsEndpoint = url;
        updateStatsUi(json);
        return;
      } catch (_) {
        // Try the next possible endpoint.
      }
    }
  }

  function startStatsLoop() {
    fetchStatsOnce();
    setInterval(fetchStatsOnce, Number(cfg.statsRefreshMs) || 5000);
  }

  function configureMusic() {
    const musicCfg = cfg.music || {};
    const player = $('musicPlayer');
    const toggle = $('musicToggle');
    const next = $('musicNext');
    const title = $('trackTitle');
    const trackState = $('trackState');
    const block = document.querySelector('.music-block');

    if (!musicCfg.enabled || !player || !Array.isArray(musicCfg.playlist) || musicCfg.playlist.length === 0) {
      if (block) block.style.display = 'none';
      return;
    }

    const volumeSlider = $('volumeSlider');
    const initialVolume = clamp(musicCfg.volume === 0 ? 0 : Number(musicCfg.volume) || 0.10, 0, 1);
    player.volume = initialVolume;

    function paintVolumeSlider() {
      if (!volumeSlider) return;
      const pct = Math.round(player.volume * 100);
      volumeSlider.value = String(pct);
      volumeSlider.style.setProperty('--volume-pct', `${pct}%`);
    }

    paintVolumeSlider();

    if (volumeSlider) {
      volumeSlider.addEventListener('input', () => {
        const pct = clamp(Number(volumeSlider.value) || 0, 0, 100);
        player.volume = pct / 100;
        volumeSlider.style.setProperty('--volume-pct', `${pct}%`);
      });
    }
    player.loop = musicCfg.playlist.length === 1;

    if (musicCfg.shuffle && musicCfg.playlist.length > 1) {
      state.trackIndex = Math.floor(Math.random() * musicCfg.playlist.length);
    }

    function setTrack(index, playAfter = false) {
      state.trackIndex = (index + musicCfg.playlist.length) % musicCfg.playlist.length;
      const track = musicCfg.playlist[state.trackIndex];
      player.src = asUrl(track.file);
      if (title) title.textContent = track.title || `Track ${state.trackIndex + 1}`;
      if (trackState) trackState.textContent = playAfter ? 'Playing' : 'Ready';
      if (playAfter) tryPlay();
    }

    async function tryPlay() {
      try {
        await player.play();
        state.musicStarted = true;
        if (toggle) toggle.textContent = '❚❚';
        if (trackState) trackState.textContent = 'Playing';
      } catch (_) {
        if (toggle) toggle.textContent = '▶';
        if (trackState) trackState.textContent = 'Click to play';
      }
    }

    function toggleMusic() {
      if (player.paused) {
        tryPlay();
      } else {
        player.pause();
        if (toggle) toggle.textContent = '▶';
        if (trackState) trackState.textContent = 'Paused';
      }
    }

    if (toggle) toggle.addEventListener('click', toggleMusic);
    if (next) next.addEventListener('click', () => setTrack(state.trackIndex + 1, true));
    player.addEventListener('ended', () => {
      if (musicCfg.loopPlaylist === false && state.trackIndex === musicCfg.playlist.length - 1) return;
      setTrack(state.trackIndex + 1, true);
    });

    setTrack(state.trackIndex, false);

    if (musicCfg.autoplay) {
      tryPlay();
      window.addEventListener('click', () => {
        if (!state.musicStarted && player.paused) tryPlay();
      }, { once: true });
    }
  }

  function init() {
    fitViewport();
    window.addEventListener('resize', fitViewport);
    window.addEventListener('orientationchange', fitViewport);
    setBackground();
    applyText();
    renderStaff();
    renderWanted();
    renderGallery();
    configureMusic();
    startStatsLoop();
    startFallbackProgress();
    applyPreviewState();
    window.addEventListener('message', handleLoadMessage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
