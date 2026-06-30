/*
  Shared config for BOTH loading screen designs.
  Edit this one file and both designs will pull the same music, staff, wanted, gallery, text, and endpoints.
  Asset paths are relative to html/.
*/
window.SharedLoadscreenConfig = {
  resourceName: 'graveyard_dual_loadscreen',

  statsEndpoint: 'auto',
  fallbackServerEndpoint: 'serveriphere',
  statsRefreshMs: 3000,

  discord: {
    inviteCode: 'TeCxSpC5wf',
    widgetEndpoint: '',
    fallback: {
      name: 'Discord Server',
      online: null,
      members: null,
      description: 'Set discord.inviteCode in shared-config.js to show the Discord widget.'
    }
  },

  cfxServerCode: 'joincodehere',
  policeEMSActivityResourceName: 'PoliceEMSActivity',

  background: {
    image: 'assets/images/background.jpg',
    overlayOpacity: 0.70
  },

  text: {
    staffTitle: 'STAFF',
    wantedTitle: 'MOST WANTED',
    galleryTitle: 'GALLERY',
    serverNamePrimary: 'servername',
    serverNameAccent: 'serveraccentname',
    tagline: 'severmotto',
    locationName: 'LOS SANTOS',
    locationSub: 'San Andreas',
    playersLabel: 'Players Online',
    dutyTitle: 'On Duty',
    loadingLabel: 'LOADING LOS SANTOS...',
    loadingSub: 'Please wait while we prepare your experience'
  },

  emergencyLabels: {
    leo: 'LEO',
    fire: 'Fire',
    ems: 'EMS'
  },

  staff: [
    { name: 'M.Bradshaw', role: 'Community Director', description: 'He is British.', accent: 'teal', image: 'assets/staff/Bradshaw.png', icon: '🛡', imageFit: 'cover', imagePosition: 'center 18%' },
    { name: 'E. Evans', role: 'Community Director', description: 'Operations, support, and server management.', accent: 'teal', image: 'assets/staff/Loop.png', icon: '✩', imageFit: 'cover', imagePosition: 'center 18%' },
    { name: 'L. Cooper', role: 'Community Director', description: 'Super Cooper Civ Director.', accent: 'purple', image: 'assets/staff/placeholder.png', icon: '◆', imageFit: 'cover', imagePosition: 'center 18%' },
    { name: 'R. Withers', role: 'Department Manager', description: 'The Kewlest Fire Chief.', accent: 'cyan', image: 'assets/staff/placeholder.png', icon: '✚', imageFit: 'cover', imagePosition: 'center 18%' },
    { name: 'K. Wolf', role: 'Department Manager', description: 'Horse Trainer Sheriff.', accent: 'orange', image: 'assets/staff/placeholder.png', icon: '☢', imageFit: 'cover', imagePosition: 'center 18%' },
    { name: 'B. Silk', role: 'Department Manager', description: 'British EMS Chief.', accent: 'teal', image: 'assets/staff/Silk.png', icon: '▰', imageFit: 'cover', imagePosition: 'center 18%' }
  ],

  wanted: [
    { name: 'Name 1', charge: 'Murder', reason: 'Murder', image: 'assets/wanted/placeholder.png', imageFit: 'cover', imagePosition: 'center center' },
    { name: 'Name 2', charge: 'Aggravated assault', reason: 'Aggravated assault', image: 'assets/wanted/placeholder.png', imageFit: 'cover', imagePosition: 'center center' },
    { name: 'Name 3', charge: 'Armed robbery', reason: 'Armed robbery', image: 'assets/wanted/placeholder.png', imageFit: 'cover', imagePosition: 'center center' },
    { name: 'Name 4', charge: 'Kidnapping', reason: 'Kidnapping', image: 'assets/wanted/placeholder.png', imageFit: 'cover', imagePosition: 'center center' },
    { name: 'Name 5', charge: 'Burglary / evasion', reason: 'Burglary / evasion', image: 'assets/wanted/placeholder.png', imageFit: 'cover', imagePosition: 'center center' },
    { name: 'Name 6', charge: 'Homicide investigation', reason: 'Homicide investigation', image: 'assets/wanted/placeholder.png', imageFit: 'cover', imagePosition: 'center center' }
  ],

  gallery: [
    { name: 'Gallery 1', title: 'Gallery 1', description: 'Community screenshot or event photo.', image: 'assets/gallery/placeholder.png', icon: '◧', imageFit: 'cover' },
    { name: 'Gallery 2', title: 'Gallery 2', description: 'Community screenshot or event photo.', image: 'assets/gallery/placeholder.png', icon: '◧', imageFit: 'cover' },
    { name: 'Gallery 3', title: 'Gallery 3', description: 'Community screenshot or event photo.', image: 'assets/gallery/placeholder.png', icon: '◧', imageFit: 'cover' },
    { name: 'Gallery 4', title: 'Gallery 4', description: 'Community screenshot or event photo.', image: 'assets/gallery/placeholder.png', icon: '◧', imageFit: 'cover' },
    { name: 'Gallery 5', title: 'Gallery 5', description: 'Community screenshot or event photo.', image: 'assets/gallery/placeholder.png', icon: '◧', imageFit: 'cover' },
    { name: 'Gallery 6', title: 'Gallery 6', description: 'Community screenshot or event photo.', image: 'assets/gallery/placeholder.png', icon: '◧', imageFit: 'cover' }
  ],

  music: {
    enabled: true,
    autoplay: true,
    volume: 0.12,
    shuffle: true,
    loopPlaylist: true,
    playlist: [
      { title: 'Taylor James', file: 'assets/music/taylorjames.mp3' },
      { title: 'GSRP 2', file: 'assets/music/GSRP2.mp3' },
      { title: 'GSRP', file: 'assets/music/GSRP.mp3' },
      { title: 'Bradshaw', file: 'assets/music/Bradshaw.mp3' },
      { title: 'Billy Bob and Rian on the Run', file: 'assets/music/BillyBobandRianontheRun.mp3' },
      { title: 'Certified Tortapounder', file: 'assets/music/certifiedtortapounder.mp3' }
    ]
  },

  previewStats: {
    players: { online: 128, max: 256 },
    duty: { leo: { count: 7 }, fire: { count: 3 }, ems: { count: 4 } }
  },
  previewProgress: 0.73
};

(function () {
  const shared = window.SharedLoadscreenConfig;

  // Config shape used by the Graveyard dashboard design.
  window.LoadscreenConfig = {
    resourceName: shared.resourceName,
    layout: { baseWidth: 1600, baseHeight: 900 },
    statsEndpoint: shared.statsEndpoint,
    fallbackServerEndpoint: shared.fallbackServerEndpoint,
    statsRefreshMs: shared.statsRefreshMs,
    background: shared.background,
    text: shared.text,
    emergencyLabels: shared.emergencyLabels,
    staff: shared.staff.map((person) => ({
      name: person.name,
      role: person.role,
      accent: person.accent || 'teal',
      image: person.image,
      icon: person.icon || '◆',
      imageFit: person.imageFit || 'cover',
      imagePosition: person.imagePosition || 'center center'
    })),
    wanted: shared.wanted.map((item) => ({
      name: item.name,
      charge: item.charge || item.reason || 'Wanted',
      image: item.image,
      imageFit: item.imageFit || 'cover',
      imagePosition: item.imagePosition || 'center center'
    })),
    gallery: shared.gallery.map((item) => ({
      name: item.name || item.title,
      image: item.image,
      icon: item.icon || '◧',
      imageFit: item.imageFit || 'cover',
      imagePosition: item.imagePosition || 'center center'
    })),
    // Child designs never own music. The parent index owns the one shared audio player.
    music: Object.assign({}, shared.music, { enabled: false }),
    previewStats: shared.previewStats,
    previewProgress: shared.previewProgress
  };
})();
