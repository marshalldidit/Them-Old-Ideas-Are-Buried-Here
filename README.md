# Them Old Ideas Are Buried Here

An interactive art installation that turns an illustrated visual album into a physical place you explore. Visitors sit down at a hand-built wooden console, turn a crank to travel across an illustrated Wild West map, and stop at real and imagined places — a homestead, a saloon, a graveyard, the moon. Each stop holds its own scene: an original illustration, its song, and a piece of the history behind it.

## Concept

Inspired by a desire to experience a musical body of work as something explorable rather than passively consumed (radio spins, music videos), this project reimagines a concept album as a navigable world. Visitors don't press play — they turn a crank and travel to a song.

The project originally began as a side-scrolling game before being scoped down to this format for time; the map-and-crank structure turned out to be a better fit for the "physical discovery" feeling the project was after.

## How It Works

- **Map Scene** — 21 markers are shown across an illustrated map. A rotary encoder cycles selection between markers; a connecting trail line to the *next* marker in sequence only appears once you're on the current one, revealing the narrative path progressively rather than all at once.
- **Illustration Scene** — Confirming a marker opens its chapter: a full illustration, its song (starting from a hand-picked cue point), and a museum-placard-style panel with contextual/historical notes. The same dial cycles between multiple context entries when a chapter has more than one.
- **Controls** — A single rotary encoder (turn + press) handles marker/context navigation and confirm/back, with meaning switching based on which scene is active. A separate potentiometer controls playback volume, with a temporary on-screen indicator that appears while adjusting and fades out after a moment of inactivity.

## Tech Stack

- **[p5.js](https://p5js.org/) (v2.x)** — core sketch, canvas rendering, scene management
- **[p5.sound](https://github.com/processing/p5.sound.js)** — chapter audio playback
- **[Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API)** — browser ↔ Arduino communication (Chrome/Edge only)
- **Arduino (Nano 33 IoT)** — reads a rotary encoder (quadrature-decoded) and a potentiometer, sends simple text commands (`NEXT`, `PREV`, `SELECT`, `VOL:<percent>`) over serial

## Hardware

- Arduino Nano 33 IoT
- Rotary encoder (KY-040 style) with push-button, wired with `INPUT_PULLUP` on all three signal pins
- Potentiometer for volume
- Housed in a hand-built wooden console designed to evoke a train conductor's control panel, in keeping with the project's Wild West setting

## Running It Locally

1. Clone/download this repo.
2. Serve the folder with a local dev server (e.g. VS Code's Live Server extension) — opening `index.html` directly via `file://` will block asset loading.
3. Open the served URL in **Chrome or Edge** (required for Web Serial support).
4. Click the canvas, then press **C** to connect the Arduino (only needed if hardware is attached — the sketch is also fully usable with keyboard/mouse alone).

## Controls (keyboard fallback)

| Key | Action |
|---|---|
| ← / → | Cycle markers (map) / contexts (chapter) |
| Enter | Confirm marker / go back |
| B | Return to map |
| F | Toggle fullscreen |
| C | Connect Arduino via Web Serial |

## Project Structure

```
├── index.html
├── sketch.js
├── illustrations/       21 chapter illustrations
├── audio/                21 chapter songs
└── TOIABH Interactive Map.png
```

## Credits

Illustration, concept, and development by James M. Marshall.
