# PartsSource AI — Chrome Extension

Injects an **AI Assistant** button into the PartsSource.com top navigation bar.
Clicking it opens a floating panel that runs the full AI procurement tool without leaving the site.

## Install (Chrome / Edge)

1. Open `chrome://extensions` (or `edge://extensions`)
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** and select this `extension/` folder
4. Navigate to [partssource.com](https://www.partssource.com) — the **AI Assistant** button appears in the top nav

## Requirements

The backend and frontend must be running locally:

```bash
# From the repo root
npm run dev
# Backend → http://localhost:3001
# Frontend → http://localhost:5173
```

## Panel features

| Control | Action |
|---|---|
| Drag header | Move panel anywhere on screen |
| `—` button | Minimize to title bar |
| `⤢` button | Open in separate window |
| `+` button | Reset / new conversation |
| `✕` button | Close panel |
| Bottom-right corner | Resize panel |

Position and size are saved in `localStorage` across page loads.
