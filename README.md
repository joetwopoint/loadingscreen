# TwoPoint Loading Screen Made For Graveyard Shift RP but can be used anywhere HIGHLY customizable

Modified PoliceEMSActivity duty support requires:

```text
https://github.com/joetwopoint/PoliceEMSActivity
```

A customizable FiveM loading screen for GTA V roleplay servers. This version includes a real FiveM loading progress bar, optional TikTok phone videos, optional YouTube background video, a clickable music player, Discord/server stats, a grouped duty summary, and rotatable Staff / Most Wanted / Gallery panels.

## Features

- Real FiveM loading progress bar using FiveM `loadProgress` messages.
- Clickable music player with previous, play/pause, next, and volume controls.
- Mouse cursor enabled on the loading screen.
- Optional right-side TikTok phone video panel.
- Optional fullscreen YouTube background video.
- Optional rotating center panels:
  - Staff Team
  - Most Wanted
  - Gallery
- Six configurable Staff slots.
- Six configurable Most Wanted slots.
- Six configurable Gallery images.
- Discord invite widget with online/member counts.
- FiveM player count display.
- Duty summary display showing grouped totals:
  - LEO
  - FIRE
  - EMS
- Config-driven setup through `html/script.js`.

## Requirements

- A FiveM server.
- The loading screen resource installed in your server resources folder.
- A valid `fxmanifest.lua` using `fx_version 'cerulean'`.
- For the duty summary feature, you need the modified PoliceEMSActivity resource from:

```text
https://github.com/joetwopoint/PoliceEMSActivity
```

The normal/original PoliceEMSActivity resource may not expose the duty JSON endpoint this loading screen expects. Use the modified version linked above if you want the LEO / FIRE / EMS summary to work.

## Installation

1. Extract the resource folder into your FiveM server resources folder.

Example:

```text
resources/[standalone]/loadingscreen
```

2. Add the loading screen to your `server.cfg`.

Example:

```cfg
ensure loadingscreen
```

3. If you want duty counts, also install and ensure the modified PoliceEMSActivity resource.

Example:

```cfg
ensure PoliceEMSActivity
ensure loadingscreen
```

4. Restart your server.

5. Join the server and verify that the loading screen appears.

## Important: fxmanifest.lua

Your `fxmanifest.lua` should use `cerulean` as the FiveM manifest version. Do not set `fx_version` to the resource package version number.

Correct:

```lua
fx_version 'cerulean'
game 'gta5'

name 'twopoint-loadingscreen'
description 'Customizable loading screen with optional phone TikToks, rotatable Staff/Most Wanted/Gallery panels, music, Discord widget, and duty stats.'
author 'TwoPoint Development'
version '4.7.0'

loadscreen 'html/index.html'
loadscreen_cursor 'yes'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js',
    'html/logo.png',
    'html/staff/*',
    'html/gallery/*',
    'html/audio/*',
    'html/wanted/*',
}
```

`loadscreen_cursor 'yes'` is required if you want players to use the music player buttons and volume slider with their mouse.

## File Structure

```text
loadingscreen/
├── fxmanifest.lua
├── README.md
└── html/
    ├── index.html
    ├── style.css
    ├── script.js
    ├── logo.png
    ├── audio/
    │   └── your music files
    ├── staff/
    │   └── staff images
    ├── wanted/
    │   └── most wanted images and board templates
    └── gallery/
        └── gallery images
```

Most customization is done inside:

```text
html/script.js
```

Most visual styling is done inside:

```text
html/style.css
```

## Main Configuration

Open:

```text
html/script.js
```

The top of the file contains the main config sections.

## Discord Widget Setup

Set your Discord invite code here:

```js
var DISCORD_INVITE_CODE = "TeCxSpC5wf";
```

Use only the invite code, not the full link.

Example:

```text
https://discord.gg/abc123
```

Use:

```js
var DISCORD_INVITE_CODE = "abc123";
```

If the Discord widget fails to load, the fallback info is controlled here:

```js
var DISCORD_WIDGET_FALLBACK = {
  name: "Discord Server",
  online: null,
  members: null,
  description: "Set DISCORD_INVITE_CODE in script.js to show the Discord widget."
};
```

## FiveM Player Count Setup

The server player count uses your FiveM HTTP endpoint:

```js
var FIVEM_SERVER_ENDPOINT = "http://YOUR_SERVER_IP:30120";
```

Example:

```js
var FIVEM_SERVER_ENDPOINT = "http://15.204.91.117:30120";
```

You can also set your CFX join code as a fallback:

```js
var CFX_SERVER_CODE = "yourcode";
```

## Duty Summary Setup

The duty box shows grouped totals only:

```text
LEO   1
FIRE  0
EMS   0
```

LEO is the total of:

```text
LSPD + BCSO + SASP
```

FIRE is the Fire count.

EMS is the EMS count.

This feature requires the modified PoliceEMSActivity resource:

```text
https://github.com/joetwopoint/PoliceEMSActivity
```

The loading screen looks for duty data using this setting:

```js
var POLICE_EMS_ACTIVITY_RESOURCE_NAME = "PoliceEMSActivity";
```

If your resource folder has a different name, change that value to match the folder name exactly.

The loading screen will automatically try:

```text
http://YOUR_SERVER_IP:30120/PoliceEMSActivity/policeemsactivity-duty.json
http://YOUR_SERVER_IP:30120/PoliceEMSActivity/duty.json
```

You can override the endpoint manually:

```js
var POLICE_EMS_ACTIVITY_DUTY_ENDPOINT = "";
```

Example:

```js
var POLICE_EMS_ACTIVITY_DUTY_ENDPOINT = "http://YOUR_SERVER_IP:30120/PoliceEMSActivity/policeemsactivity-duty.json";
```

Department matching is controlled here:

```js
const DUTY_DEPARTMENTS = [
  { key: "lspd", label: "👮 LSPD", aliases: ["lspd", "los santos police", "police"], color: 57 },
  { key: "bcso", label: "👮 BCSO", aliases: ["bcso", "sheriff", "blaine county"], color: 52 },
  { key: "sasp", label: "👮 SASP", aliases: ["sasp", "state", "state police", "highway patrol", "trooper"], color: 54 },
  { key: "fire", label: "👨‍🚒 Fire", aliases: ["fire", "fd", "safr", "firefighter"], color: 1 },
  { key: "ems", label: "🚑 EMS", aliases: ["ems", "ambulance", "medical", "medic"], color: 63 }
];
```

If your PoliceEMSActivity roles use different names, add those names to the correct `aliases` array.

## Real Loading Progress Bar

The progress bar uses FiveM loading progress messages.

Config:

```js
const REAL_LOAD_PROGRESS_ENABLED = true;
const REAL_LOAD_PROGRESS_SMOOTHING = true;
const REAL_LOAD_PROGRESS_SHOW_PERCENT = true;
```

When enabled, the green bar fills based on the player's actual loading progress.

The percentage is shown beside the connecting text:

```text
Connecting to Graveyard Shift Roleplay… 47%
```

When testing the HTML file in a normal browser, the progress may stay at `0%` because FiveM is not sending `loadProgress` events outside the game.

## Music Player Setup

The music player is controlled here:

```js
const AUDIO_ENABLED = true;
let audioDefaultVolume = 0.12;

const MUSIC_PLAYER_WIDGET_ENABLED = true;
const MUSIC_PLAYER_RANDOM_FIRST_TRACK = true;
const MUSIC_PLAYER_SHOW_TRACK_NAME = true;
```

Music files are listed here:

```js
const AUDIO_TRACKS = [
  "audio/taylorjames.mp3",
  "audio/GSRP2.mp3",
  "audio/GSRP.mp3",
  "audio/Bradshaw.mp3",
  "audio/BillyBobandRianontheRun.mp3",
  "audio/certifiedtortapounder.mp3",
];
```

To add music:

1. Put the `.mp3` or `.ogg` file in:

```text
html/audio/
```

2. Add it to `AUDIO_TRACKS`.

Example:

```js
"audio/mynewsong.mp3",
```

Music player controls:

- Previous song
- Play/pause
- Next song
- Volume slider

Keyboard shortcuts:

- Space = play/pause
- Left arrow = previous song
- Right arrow = next song
- Up arrow = volume up
- Down arrow = volume down

## Music Player Position and Styling

The music player styling is in:

```text
html/style.css
```

Look for:

```css
.music-player-widget
```

Position controls are set with CSS variables:

```css
--music-player-top: 4.25vh;
--music-player-left: 5vw;
--music-player-width: 380px;
```

Adjust those values if you want the widget higher, lower, left, right, wider, or smaller.

## Center Feature Panels

The center panel can show one panel or rotate through multiple panels.

Config:

```js
const FEATURE_PANEL_MODE = "rotate";
const SINGLE_FEATURE_PANEL = "mostwanted";
const FEATURE_ROTATION_INTERVAL_MS = 8000;
const FEATURE_ROTATION_ORDER = ["staff", "mostwanted", "gallery"];
```

Use one panel only:

```js
const FEATURE_PANEL_MODE = "single";
const SINGLE_FEATURE_PANEL = "staff";
```

Valid panel names:

```text
staff
mostwanted
gallery
```

Rotate all enabled panels:

```js
const FEATURE_PANEL_MODE = "rotate";
const FEATURE_ROTATION_ORDER = ["staff", "mostwanted", "gallery"];
```

Change rotation speed:

```js
const FEATURE_ROTATION_INTERVAL_MS = 8000;
```

`8000` means 8 seconds.

## Feature Panel Size

Panel size controls:

```js
const FEATURE_PANEL_SCALE = 1.05;
const FEATURE_PANEL_WIDTH_VW = 56;
const FEATURE_PANEL_MAX_WIDTH_PX = 1080;
const FEATURE_PANEL_NO_PHONE_WIDTH_VW = 72;
const FEATURE_PANEL_NO_PHONE_MAX_WIDTH_PX = 1240;
const FEATURE_PANEL_MAX_HEIGHT_VH = 94;
```

Staff sizing:

```js
const STAFF_CARD_MIN_HEIGHT_PX = 152;
const STAFF_AVATAR_SIZE_PX = 112;
```

Gallery sizing:

```js
const GALLERY_CARD_MIN_HEIGHT_PX = 265;
const GALLERY_IMAGE_MIN_HEIGHT_PX = 225;
```

Most Wanted board sizing:

```js
const MOST_WANTED_BOARD_MAX_WIDTH_PX = 850;
const MOST_WANTED_BOARD_MAX_HEIGHT_VH = 92;
```

## Staff Panel Setup

Enable or disable Staff:

```js
const STAFF_ENABLED = true;
```

Staff image settings:

```js
const STAFF_PHOTO_FIT = "contain";
const STAFF_PHOTO_POSITION = "center center";
```

Staff entries:

```js
const staffMembers = [
  {
    name: "Bradshaw",
    role: "Community Director",
    description: "Smelly British Man.",
    image: "staff/Bradshaw.png"
  },
];
```

To add staff images:

1. Put the image in:

```text
html/staff/
```

2. Reference it like this:

```js
image: "staff/example.png"
```

The panel is designed for six staff slots.

## Most Wanted Panel Setup

Enable or disable Most Wanted:

```js
const MOST_WANTED_ENABLED = true;
```

Most Wanted image settings:

```js
const MOST_WANTED_PHOTO_FIT = "contain";
const MOST_WANTED_PHOTO_POSITION = "center center";
```

Wanted entries:

```js
const MOST_WANTED_SUSPECTS = [
  {
    name: "Marcus Bradshaw",
    reason: "Smelly British Man",
    image: "wanted/Bradshaw1.png",
    photoPosition: "center center"
  },
];
```

To add wanted images:

1. Put the image in:

```text
html/wanted/
```

2. Reference it like this:

```js
image: "wanted/example.png"
```

The panel is designed for six wanted slots.

The Most Wanted board image used by default is:

```text
html/wanted/most_wanted_template_cropped.png
```

If you replace the board template, keep the same filename or update `html/index.html`.

## Gallery Panel Setup

Enable or disable Gallery:

```js
const GALLERY_ENABLED = true;
```

Gallery image settings:

```js
const GALLERY_PHOTO_FIT = "contain";
const GALLERY_PHOTO_POSITION = "center center";
```

Captions are disabled by default:

```js
const GALLERY_SHOW_CAPTIONS = false;
```

Gallery entries:

```js
const GALLERY_PHOTOS = [
  {
    title: "Gallery 1",
    description: "Community screenshot or event photo.",
    image: "gallery/placeholder.png"
  },
];
```

To add gallery images:

1. Put the image in:

```text
html/gallery/
```

2. Reference it like this:

```js
image: "gallery/example.png"
```

The gallery is designed for six large image tiles.

## TikTok Phone Panel

Enable or disable the right-side TikTok phone:

```js
const PHONE_TIKTOK_ENABLED = true;
```

TikTok playback settings:

```js
const TIKTOK_MUTED_BY_DEFAULT = true;
const TIKTOK_TARGET_VOLUME_PERCENT = 15;
const TIKTOK_SHOW_CONTROLS = true;
const TIKTOK_RANDOMIZE_FIRST_CLIP = true;
const TIKTOK_AUTO_ADVANCE = true;
```

TikTok videos:

```js
const tikTokUrls = [
  "https://www.tiktok.com/@graveyard_shift_rp/video/7554841913027792183",
];
```

Add or remove TikTok links from that list.

If you want to use only a background video and no phone panel, set:

```js
const PHONE_TIKTOK_ENABLED = false;
```

## Optional YouTube Background Video

Enable or disable fullscreen YouTube background video:

```js
const BACKGROUND_VIDEO_ENABLED = false;
```

YouTube links:

```js
const BACKGROUND_YT_URLS = [
  "https://www.youtube.com/watch?v=gQuAaHQrl8U"
];
```

Supported formats:

```text
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/shorts/VIDEO_ID
https://www.youtube.com/embed/VIDEO_ID
https://www.youtube.com/live/VIDEO_ID
```

Playback settings:

```js
const BACKGROUND_YOUTUBE_MUTED = true;
const BACKGROUND_YOUTUBE_SHOW_CONTROLS = false;
const BACKGROUND_YOUTUBE_LOOP = true;
const BACKGROUND_YOUTUBE_RANDOMIZE_FIRST = true;
const BACKGROUND_YOUTUBE_USE_NOCOOKIE = false;
```

Muted autoplay is usually the most reliable option for loading screens.

## Logo Replacement

Replace:

```text
html/logo.png
```

with your own logo.

Keep the filename as `logo.png`, or update all references in `html/index.html` and `html/style.css`.

## Tips

Tips rotate on the left side of the screen.

Edit them here:

```js
const tips = [
  "Be respectful to other players. RP > FRP.",
  "Read the rules in Discord before you hit the streets.",
  "Use push-to-talk and keep comms clear during scenes.",
  "Record your POV – it helps with reports and clips.",
  "Have fun, but remember: actions have consequences."
];
```

## Troubleshooting

### The loading screen does not show

Check `server.cfg`:

```cfg
ensure loadingscreen
```

Check `fxmanifest.lua`:

```lua
fx_version 'cerulean'
loadscreen 'html/index.html'
```

### Mouse does not work on the music player

Make sure this line exists in `fxmanifest.lua`:

```lua
loadscreen_cursor 'yes'
```

### Real progress bar stays at 0% in browser

That is normal when opening `index.html` in a normal browser. The real progress messages come from FiveM while a player is loading into the server.

### Duty summary shows 0 for everything

Check all of these:

1. Install the modified PoliceEMSActivity resource:

```text
https://github.com/joetwopoint/PoliceEMSActivity
```

2. Make sure it is ensured in `server.cfg`:

```cfg
ensure PoliceEMSActivity
```

3. Make sure the folder name matches:

```js
var POLICE_EMS_ACTIVITY_RESOURCE_NAME = "PoliceEMSActivity";
```

4. Make sure your FiveM endpoint is correct:

```js
var FIVEM_SERVER_ENDPOINT = "http://YOUR_SERVER_IP:30120";
```

5. Test the JSON endpoint in a browser:

```text
http://YOUR_SERVER_IP:30120/PoliceEMSActivity/policeemsactivity-duty.json
```

If your resource is renamed, replace `PoliceEMSActivity` in the URL with your actual folder name.

### Discord widget does not show correct counts

Check your invite code:

```js
var DISCORD_INVITE_CODE = "yourInviteCode";
```

Do not paste the full Discord invite URL into that field.

### TikTok videos do not load

Check that the TikTok URLs are valid and public. TikTok embeds can also be affected by network restrictions, ad blockers, or TikTok availability.

### YouTube background does not autoplay

Use muted autoplay:

```js
const BACKGROUND_YOUTUBE_MUTED = true;
```

Also make sure the YouTube URL is public and embeddable.

### Music does not play automatically

Some clients may block autoplay until interaction. The music player still allows users to press play manually.

### Images do not show

Check that the image file exists in the correct folder and that the path in `script.js` is correct.

Examples:

```js
image: "staff/Bradshaw.png"
image: "wanted/Bradshaw1.png"
image: "gallery/placeholder.png"
```

Paths are relative to the `html/` folder.

## Notes for Server Owners

- Keep file names simple: avoid spaces and special characters when possible.
- Use `.png`, `.jpg`, `.jpeg`, or `.webp` for images.
- Use `.mp3` or `.ogg` for audio.
- Keep Most Wanted reasons short so they fit under the photos.
- Keep Staff descriptions short so the cards stay clean.
- If you use copyrighted music, make sure you have permission to use it on your server.

## Credits

Created By TwoPoint Development For Graveyard Shift Roleplay.
