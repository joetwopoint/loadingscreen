# Graveyard Shift Roleplay Loading Screen

This build uses:

- Discord invite-code widget card for Discord online/member counts
- FiveM `players.json`/cfx.re fallback for people in state
- PoliceEMSActivity for on-duty department counts
- TikTok shorts with configurable mute/volume/autoplay behavior

## Start order

```cfg
ensure Badger_Discord_API
ensure PoliceEMSActivity
ensure twopoint-loadingscreen
```

## Required config

Edit:

```text
twopoint-loadingscreen/html/script.js
```

Set your FiveM server endpoint:

```js
var FIVEM_SERVER_ENDPOINT = "http://YOUR_SERVER_IP:30120";
```

Set your Discord invite code for the widget-style card:

```js
var DISCORD_INVITE_CODE = "yourInviteCode";
```

Use only the invite code, not the whole URL. For example:

```js
// discord.gg/abc123
var DISCORD_INVITE_CODE = "abc123";
```

The old “email system” line has been replaced with a Discord-style card showing:

- server name/icon/banner when available
- online Discord users
- total Discord members

There is no Join / Go To Server button.

The people-in-state line stays directly below the Discord card:

```text
There is currently X people in the state
```

## PoliceEMSActivity duty display

The on-duty box is still powered only by `PoliceEMSActivity`.

The loading screen reads:

```text
http://YOUR_SERVER_IP:30120/PoliceEMSActivity/policeemsactivity-duty.json
```

If your PoliceEMSActivity folder has a different name, update:

```js
var POLICE_EMS_ACTIVITY_RESOURCE_NAME = "PoliceEMSActivity";
```

Departments displayed only when someone is on duty:

- 👮 LSPD
- 👮 BCSO
- 👮 SASP
- 👨‍🚒 Fire
- 🚑 EMS

Duty refresh is set to 5 minutes:

```js
var POLICE_EMS_ACTIVITY_DUTY_REFRESH_MS = 300000;
```

## TikTok audio

TikTok videos play in order and auto-advance. Configure audio here:

```js
const TIKTOK_MUTED_BY_DEFAULT = false;
const TIKTOK_TARGET_VOLUME_PERCENT = 25;
const TIKTOK_AUTO_ADVANCE = true;
```

Set this to `true` if you want local MP3 loading-screen music instead of TikTok audio:

```js
const TIKTOK_MUTED_BY_DEFAULT = true;
```
