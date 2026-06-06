# TwoPoint Loading Screen

A custom FiveM loading screen package developed by **TwoPoint Development**.

This package includes a branded loading screen with TikTok shorts, local background audio, live server population, a Discord invite-card display, and PoliceEMSActivity-powered department duty counts.

## Features

### Loading Screen

- Custom branded FiveM loading screen.
- Server logo, title, subtitle, status text, progress bar, and rotating server tips.
- Optional staff panel with images, roles, and descriptions.
- Local background music support with multiple audio tracks.
- TikTok phone-frame video player.
- TikTok clips play in configured list order.
- TikTok clips auto-advance and loop back to the first video.
- Configurable TikTok mute setting.
- Configurable TikTok target volume setting.
- Optional fullscreen background video support.

### Live Server Stats

- Displays current FiveM player count from `players.json`.
- Supports cfx.re join-code fallback when a direct server endpoint is not configured.
- Displays the people-in-state count directly below the Discord card.

### Discord Invite Card

- Displays a Discord-style server card using only an invite code.
- Shows server name, icon, banner/splash when available, online count, and member count.
- Does not display a Join Server button.
- Supports a custom invite widget endpoint if a proxy is preferred.
- Includes fallback text while the invite code is being configured.

### PoliceEMSActivity Department Duty Display

- Uses PoliceEMSActivity as the only source for on-duty department data.
- No separate TwoPoint duty tracker is included.
- Reads duty information from the patched PoliceEMSActivity HTTP endpoint.
- Hides departments with zero active units.
- Supports the configured PoliceEMSActivity departments:
  - 👮 LSPD
  - 👮 BCSO
  - 👮 SASP
  - 👨‍🚒 Fire
  - 🚑 EMS
- Duty data refreshes every 5 minutes by default.

## Resource Structure

```text
twopoint-loadingscreen/
├── fxmanifest.lua
└── html/
    ├── index.html
    ├── style.css
    ├── script.js
    ├── logo.png
    ├── audio/
    └── staff/

PoliceEMSActivity/
├── fxmanifest.lua
├── config.lua
├── server.lua
├── client.lua
└── EmergencyBlips/
```

## Requirements

- FiveM server using `fx_version 'cerulean'`.
- `Badger_Discord_API` installed and started before PoliceEMSActivity.
- Patched `PoliceEMSActivity` resource included with this package.
- Public Discord invite code for the Discord card.
- A reachable FiveM HTTP endpoint for `players.json`, or a valid cfx.re join code fallback.

## Installation

1. Upload both folders to your server resources directory:

```text
resources/[standalone]/PoliceEMSActivity
resources/[standalone]/twopoint-loadingscreen
```

2. Add the resources to `server.cfg` in this order:

```cfg
ensure Badger_Discord_API
ensure PoliceEMSActivity
ensure twopoint-loadingscreen
```

3. Restart the server or restart the resources in the same order.

## Required Configuration

Edit:

```text
twopoint-loadingscreen/html/script.js
```

### Discord Invite Card

Set only the invite code, not the full URL:

```js
var DISCORD_INVITE_CODE = "yourInviteCode";
```

Examples:

```js
// discord.gg/abc123
var DISCORD_INVITE_CODE = "abc123";

// discord.com/invite/graveyardrp
var DISCORD_INVITE_CODE = "graveyardrp";
```

The Discord card uses:

```text
https://discord.com/api/v10/invites/YOUR_CODE?with_counts=true
```

This returns the public invite data used for the card, including online and member counts when available.

### FiveM People-in-State Count

Set the public HTTP endpoint for your FiveM server:

```js
var FIVEM_SERVER_ENDPOINT = "http://YOUR_SERVER_IP:30120";
```

Example:

```js
var FIVEM_SERVER_ENDPOINT = "http://123.45.67.89:30120";
```

This allows the loading screen to read:

```text
http://YOUR_SERVER_IP:30120/players.json
```

If you do not want to use a direct IP/port endpoint, set a cfx.re join code fallback:

```js
var CFX_SERVER_CODE = "abc123";
```

Use only the join code. For example, if your join link is:

```text
https://cfx.re/join/abc123
```

then configure:

```js
var CFX_SERVER_CODE = "abc123";
```

## PoliceEMSActivity Duty Setup

Duty data is read from PoliceEMSActivity. The loading screen does not track duty state on its own.

Default resource name:

```js
var POLICE_EMS_ACTIVITY_RESOURCE_NAME = "PoliceEMSActivity";
```

Default duty endpoint:

```text
http://YOUR_SERVER_IP:30120/PoliceEMSActivity/policeemsactivity-duty.json
```

If your PoliceEMSActivity folder name is different, update the resource name in `script.js`:

```js
var POLICE_EMS_ACTIVITY_RESOURCE_NAME = "YourFolderName";
```

Or set a full custom endpoint:

```js
var POLICE_EMS_ACTIVITY_DUTY_ENDPOINT = "http://YOUR_SERVER_IP:30120/YourFolderName/policeemsactivity-duty.json";
```

By default, leave this blank:

```js
var POLICE_EMS_ACTIVITY_DUTY_ENDPOINT = "";
```

### Department List

The loading screen department display should match `PoliceEMSActivity/config.lua`:

```lua
Config = {
    RoleList = {
        ['👮 LSPD'] = {1183541910510518296, 57, nil},
        ['👮 BCSO'] = {1183541910405652580, 52, nil},
        ['👮 SASP'] = {1183541910615363646, 54, nil},
        ['👨‍🚒 Fire'] = {1183541910367912043, 1, nil},
        ['🚑 EMS'] = {1183541910367912041, 63, nil},
    },
}
```

The matching display list in `twopoint-loadingscreen/html/script.js` is:

```js
const DUTY_DEPARTMENTS = [
  { key: "lspd", label: "👮 LSPD", aliases: ["lspd", "los santos police", "police"], color: 57 },
  { key: "bcso", label: "👮 BCSO", aliases: ["bcso", "sheriff", "blaine county"], color: 52 },
  { key: "sasp", label: "👮 SASP", aliases: ["sasp", "state", "state police", "highway patrol", "trooper"], color: 54 },
  { key: "fire", label: "👨‍🚒 Fire", aliases: ["fire", "fd", "safr", "firefighter"], color: 1 },
  { key: "ems", label: "🚑 EMS", aliases: ["ems", "ambulance", "medical", "medic"], color: 63 }
];
```

Only departments with active on-duty units are shown.

### Duty Refresh Rate

Duty stats refresh every 5 minutes by default:

```js
var POLICE_EMS_ACTIVITY_DUTY_REFRESH_MS = 300000;
```

`300000` milliseconds equals 5 minutes.

## Discord Total Member Count Options

The Discord invite card is the recommended method for the public GitHub version because it only requires an invite code.

The patched PoliceEMSActivity resource also includes optional backend Discord count support for servers that want a backend-controlled count endpoint:

```lua
LOADING_SCREEN_DISCORD_GUILD_ID = 'YOUR_GUILD_ID'
LOADING_SCREEN_DISCORD_INVITE_CODE = 'yourInviteCode'
LOADING_SCREEN_DISCORD_MEMBER_COUNT_OVERRIDE = nil
LOADING_SCREEN_DISCORD_BOT_TOKEN = ''
LOADING_SCREEN_DISCORD_BOT_TOKEN_CONVAR = 'discord_bot_token'
LOADING_SCREEN_DISCORD_REFRESH_SECONDS = 300
```

For the safest bot-token setup, place the token in `server.cfg` instead of a Lua file:

```cfg
set discord_bot_token "YOUR_BOT_TOKEN"
```

The bot must be in the Discord server if the bot-token method is used.

## TikTok Configuration

Edit:

```text
twopoint-loadingscreen/html/script.js
```

### Playback Settings

```js
const TIKTOK_MUTED_BY_DEFAULT = false;
const TIKTOK_TARGET_VOLUME_PERCENT = 25;
const TIKTOK_SHOW_CONTROLS = true;
const TIKTOK_RANDOMIZE_FIRST_CLIP = false;
const TIKTOK_AUTO_ADVANCE = true;
```

Recommended setups:

Use TikTok audio:

```js
const TIKTOK_MUTED_BY_DEFAULT = false;
const TIKTOK_TARGET_VOLUME_PERCENT = 25;
```

Use local loading-screen music instead:

```js
const TIKTOK_MUTED_BY_DEFAULT = true;
```

TikTok embeds may still be affected by browser autoplay behavior. The loading screen attempts to play and unmute when allowed by the embedded player.

### TikTok Video List

Videos play in the configured order:

```js
const tikTokUrls = [
  "https://www.tiktok.com/@youraccount/video/1234567890",
  "https://www.tiktok.com/@youraccount/video/0987654321"
];
```

After the last video, playback loops back to the first video.

### Clip Advance Fallback

If TikTok does not send an ended event, the fallback timer advances to the next clip:

```js
const CLIP_DURATION_MS = 30000;
```

`30000` milliseconds equals 30 seconds.

## Local Background Audio

Local background audio is controlled in `script.js`:

```js
const AUDIO_ENABLED = true;
let audioDefaultVolume = 0.12;
```

Add audio files to:

```text
twopoint-loadingscreen/html/audio/
```

Then list them:

```js
const AUDIO_TRACKS = [
  "audio/track-one.mp3",
  "audio/track-two.mp3"
];
```

When TikTok audio is enabled, consider lowering or disabling local music to avoid overlapping audio.

## Staff Panel

The staff panel is disabled by default:

```js
const STAFF_ENABLED = false;
```

Enable it:

```js
const STAFF_ENABLED = true;
```

Add staff images to:

```text
twopoint-loadingscreen/html/staff/
```

Example staff entry:

```js
const staffMembers = [
  {
    name: "Jane Doe",
    role: "Community Manager",
    description: "Handles community support and questions.",
    image: "staff/jane.png"
  }
];
```

## Server Tips

Tips are configured in `script.js`:

```js
const tips = [
  "Be respectful to other players. RP > FRP.",
  "Read the rules in Discord before you hit the streets."
];
```

## Custom Branding

### Logo

Replace:

```text
twopoint-loadingscreen/html/logo.png
```

Use the same filename or update `index.html` and `style.css` to point to the new file.

### Title and Subtitle

Edit `twopoint-loadingscreen/html/index.html`:

```html
<div class="logo-title">Graveyard Shift ROLEPLAY</div>
<div class="subtitle">@graveyardroleplay</div>
```

### Status Text

Edit:

```html
<div class="status-text">Connecting to Graveyard Shift Roleplay…</div>
```

### Colors and Layout

Edit:

```text
twopoint-loadingscreen/html/style.css
```

## HTTP Endpoints

The patched PoliceEMSActivity resource provides these loading-screen endpoints:

### Duty Stats

```text
/PoliceEMSActivity/policeemsactivity-duty.json
/PoliceEMSActivity/duty.json
```

Example payload:

```json
{
  "type": "dutyStats",
  "source": "PoliceEMSActivity",
  "updatedAt": 1710000000,
  "departments": [
    {
      "label": "👮 LSPD",
      "count": 3,
      "names": ["Officer One", "Officer Two", "Officer Three"]
    }
  ]
}
```

### Optional Discord Member Count

```text
/PoliceEMSActivity/discord-member-count.json
/PoliceEMSActivity/discord-count.json
```

Example payload:

```json
{
  "type": "discordMemberCount",
  "source": "discord-invite-count",
  "ok": true,
  "memberCount": 137,
  "onlineCount": 51,
  "updatedAt": 1710000000
}
```

## Troubleshooting

### Discord card shows `--`

Check the following:

- `DISCORD_INVITE_CODE` is set in `script.js`.
- The invite code is valid and not expired.
- The invite is written as only the code, not a full URL.
- The loading screen client can reach Discord's public invite API.

### People in state shows `0` or does not update

Check the following:

- `FIVEM_SERVER_ENDPOINT` is set correctly.
- The endpoint includes protocol and port, such as `http://123.45.67.89:30120`.
- `http://YOUR_SERVER_IP:30120/players.json` opens in a browser.
- If direct endpoint access is not available, set `CFX_SERVER_CODE`.

### On-duty departments show no units

Check the following:

- `PoliceEMSActivity` is started before `twopoint-loadingscreen`.
- The included patched PoliceEMSActivity resource is installed.
- The folder name matches `POLICE_EMS_ACTIVITY_RESOURCE_NAME`.
- Players are actually on duty through PoliceEMSActivity.
- The department labels in `Config.RoleList` match the loading-screen `DUTY_DEPARTMENTS` labels/aliases.
- Open this URL in a browser and confirm it returns JSON:

```text
http://YOUR_SERVER_IP:30120/PoliceEMSActivity/policeemsactivity-duty.json
```

### Duty endpoint returns 404

Check the resource folder name. FiveM resource HTTP paths include the resource name:

```text
http://YOUR_SERVER_IP:30120/RESOURCE_NAME/path
```

If the folder is named differently, update:

```js
var POLICE_EMS_ACTIVITY_RESOURCE_NAME = "PoliceEMSActivity";
```

### TikTok does not unmute automatically

Browser autoplay rules may block unmuted playback until a user interaction is allowed by the embedded player. The loading screen sends supported play, mute, unmute, and volume messages, but final playback behavior can depend on the FiveM browser environment and TikTok embed behavior.

### TikTok does not advance

Check the following:

- `TIKTOK_AUTO_ADVANCE` is set to `true`.
- The links in `tikTokUrls` are public video URLs.
- `CLIP_DURATION_MS` is set to a reasonable fallback duration.

## Recommended `server.cfg`

```cfg
ensure Badger_Discord_API
ensure PoliceEMSActivity
ensure twopoint-loadingscreen

# Optional backend Discord count support
# set discord_bot_token "YOUR_BOT_TOKEN"
```

## Changelog

### v4.0.0

- Replaced the old email-system text count with a Discord invite-card display.
- Added Discord invite-code configuration.
- Added Discord server icon, banner/splash, online count, and total member count display.
- Removed the Join Server button from the Discord display.
- Kept people-in-state count directly below the Discord card.
- Removed separate TwoPoint duty tracking from the loading screen.
- Switched duty display to PoliceEMSActivity-only data.
- Added patched PoliceEMSActivity HTTP endpoints for duty stats.
- Added 5-minute duty refresh interval.
- Added supported LSPD, BCSO, SASP, Fire, and EMS department display.
- Hid duty departments with zero active units.
- Improved FiveM people-in-state count handling.
- Added cfx.re join-code fallback for population count.
- Added TikTok ordered playlist playback.
- Added TikTok auto-advance and loop behavior.
- Added TikTok mute/unmute configuration.
- Added TikTok target volume configuration.
- Kept local MP3 background music support.
- Added expanded setup and troubleshooting documentation.

### v3.x Development Notes

- Added live state population display.
- Added early Discord count display.
- Added first PoliceEMSActivity duty bridge.
- Removed legacy QBCore/ESX duty polling in favor of PoliceEMSActivity.
- Improved resource start-order handling.
- Improved endpoint path handling for FiveM resource HTTP routes.

## Credits

Developed by **TwoPoint Development**.

## Support Notes

When opening a support request, include:

- Server artifacts version.
- Resource folder names.
- Your `server.cfg` start order.
- The relevant `script.js` config values with private tokens removed.
- Any console errors from the FiveM client or server console.
- The output from the duty endpoint URL, if available.
