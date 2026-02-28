# twopoint-loadingscreen  
Customizable FiveM Loading Screen

A clean, modern FiveM loading screen that you can brand for **any server**. Features:

- Plays **random TikTok clips** from your own links  
- Shows a **phone-style frame** with the shorts inside  
- Has a big **background logo watermark** (customizable)  
- Optional **staff list** with round character pictures  
- Shows **server tips** while the player loads  

This is a pure **loadscreen resource** using FiveM’s `loadscreen` directive – no in-game UI.

---

## 1. Installation

1. Drop the folder into your resources:

   ```text
   resources/[loadscreen]/twopoint-loadingscreen
   ```

2. In your `server.cfg`, add:

   ```cfg
   ensure twopoint-loadingscreen
   ```

3. Restart the server (or `refresh` + `ensure twopoint-loadingscreen` from console).

Players will see this while connecting to your server.

---

## 2. File Structure

```text
twopoint-loadingscreen/
├─ fxmanifest.lua
├─ README.md
└─ html/
   ├─ index.html        # Main loadscreen layout
   ├─ style.css         # Styling (backgrounds, phone frame, staff layout)
   ├─ script.js         # Logic: random shorts, tips, staff, config
   ├─ logo.png          # Main server logo (center watermark + left panel)
   └─ staff/
      ├─ README.txt     # Instructions for staff avatars
      └─ (your staff images go here)
```

### Changing the main logo

- Replace `html/logo.png` with your **server logo** (same filename).

No dev/brand corner logo is used in this version.

---

## 3. Basic Config (script.js)

All configuration is done in:

```text
html/script.js
```

Open that file in a text editor (VS Code, Notepad++, etc.).

### 3.1. Staff Panel Toggle

At the top of `script.js`:

```js
// Staff toggle: set to true to show staff list column.
const STAFF_ENABLED = false;
```

- `false` = no staff column (2-column layout: info + phone)
- `true`  = show staff column in the middle (3-column layout)

---

### 3.2. Staff Members List

Right under `STAFF_ENABLED`:

```js
const staffMembers = [
  // Example:
  // {
  //   name: "Jane Doe",
  //   role: "Community Manager",
  //   description: "Handles support & questions.",
  //   image: "staff/jane.png"
  // }
];
```

To use it, set `STAFF_ENABLED = true` and fill it in, for example:

```js
const staffMembers = [
  {
    name: "Alex",
    role: "Owner",
    description: "Main contact for server issues.",
    image: "staff/alex.png"
  },
  {
    name: "Sam",
    role: "Staff Lead",
    description: "Handles staff apps & reports.",
    image: "staff/sam.jpg"
  }
];
```

#### Staff Images

- Put your staff character images in:

  ```text
  html/staff/
  ```

- Example files:

  ```text
  html/staff/alex.png
  html/staff/sam.jpg
  ```

- In `script.js`, the `image` field should be the **relative path** from `html/`, e.g.:

  ```js
  image: "staff/alex.png"
  ```

Images show as **small round avatars** with a gold border next to the staff name/role.

If `STAFF_ENABLED` is `false` or `staffMembers` is empty, the middle column is hidden and the layout automatically falls back to two columns.

---

### 3.3. Shorts Source (TikTok Only)

The phone frame now uses **TikTok clips only**.  
There is no longer a YouTube option for the phone itself.

You don’t need to configure any selector for TikTok vs YouTube here – it will always pull from the TikTok URL list in `html/script.js`.
### 3.4. TikTok URLs & Optional Background Video

#### TikTok (phone frame)

Fill this with any TikTok video/photo URLs you want. The phone frame will pick randomly from this list:

```js
const tikTokUrls = [
  "https://www.tiktok.com/@yourserver/video/1234567890123456789",
  // add more TikTok links here
];
```

#### Optional YouTube background video

If you want a soft fullscreen background video behind the loading screen, you can enable it in `html/script.js`:

```js
const BACKGROUND_VIDEO_ENABLED = false; // set to true to enable
const BACKGROUND_YT_URLS = [
  "https://www.youtube.com/watch?v=VIDEOID",
  // add more regular YouTube video links here
];
```

> Note: The background video uses regular **YouTube watch URLs**, not Shorts.
### 3.5. Clip Duration

Time before switching to the next random clip:

```js
const CLIP_DURATION_MS = 30000; // 30 seconds
```

Increase or decrease (value is in milliseconds).

---

### 3.6. Volume Behavior

At the top of `script.js` there’s a logical volume value:

```js
let volumePercent = 20;
```

- This is reflected in the **“Volume: XX%”** text under the phone.
- The **Up/Down arrow keys** update this value and can be used by any optional
  background video logic you might add.
- TikTok iframes themselves don’t expose volume controls to the page, so the
  arrows **won’t directly change TikTok audio** – players may still need to use
  the built‑in TikTok controls if audio is muted for them.
## 4. Visual Features

- **Background**
  - Soft radial gradient background
  - Dark overlay
  - Large, faint **background watermark logo** (from `logo.png`)

- **Left Column**
  - Main logo + server name text
  - “Connecting...” status
  - Animated progress bar
  - Short description about loading/shorts
  - Rotating **server tips**

- **Middle Column (optional)**
  - “Staff Team” title
  - List of staff cards with:
    - Round avatar (character image)
    - Name, role, small description  

- **Right Column**
  - “Random shorts from our socials” title
  - Phone-style frame:
    - Curved device border, top speaker and camera dot
    - Shorts iframe inside as the screen
  - Volume readout + note about clips possibly starting muted / needing click

Everything is skinned via CSS, so you can tweak colors, radiuses, shadows, etc., in `style.css`.

---

Drag-and-drop ready for FiveM. Customize and enjoy ✌️
