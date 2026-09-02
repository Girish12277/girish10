# vlc

Build a browser-based VLC Media Player inspired video player.

React 18 + TypeScript strict + Vite + Tailwind CSS.

Native HTMLVideoElement — zero external player libraries.

Web Audio API for equalizer + audio processing.

Everything customizable. Everything performant.

Zero lag. Zero compromise.

We spent two years building this.

Every pixel argued over. Every millisecond profiled.

This is the player that VLC users deserve on the web.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHY THIS IS DIFFERENT FROM EVERY OTHER WEB PLAYER

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VLC is not a media player.

VLC is a philosophy.

It plays everything. It does everything.

Nothing is locked. Nothing is hidden.

Every preference is exposed and respected.

This web player inherits that philosophy.

If a setting exists, it is accessible.

If a color can be changed, it is changeable.

If a behavior can be tweaked, there is a knob for it.

The user is trusted. Always.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PERFORMANCE CONTRACT (non-negotiable)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These are not aspirational. These are requirements.

60fps seek bar animation: requestAnimationFrame ONLY.

  Never onTimeUpdate for seek bar movement.

  onTimeUpdate fires at browser discretion (250ms+).

  rAF fires every 16ms. The difference is visible.

  We noticed this in user testing in week 3.

  We fixed it. We never went back.

Zero re-renders on time tick:

  useRef for video element and current time.

  Only Zustand store — never React state —

  for values that update every frame.

  Components that don't need current time

  must never re-render because of it.

Volume slider: responds in < 4ms.

  Direct DOM manipulation for slider position.

  No React render cycle in the hot path.

Seek preview thumbnail:

  Offscreen canvas draws at 160×90.

  Debounced 80ms — not every mouse move.

  Canvas reuse — never create/destroy mid-hover.

Keyboard shortcuts: < 8ms response time.

  keydown handler is outside React.

  Registered once on mount, cleaned up on unmount.

  Never goes through synthetic event system.

Memory: clean on unmount.

  All rAF loops cancelled.

  All event listeners removed.

  All Web Audio nodes disconnected.

  All object URLs revoked.

  Verified with Chrome DevTools memory profiler.

  We have screenshots. It is clean.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THEMING SYSTEM (the soul of this build)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Everything is a CSS custom property.

Every color, every radius, every shadow.

User changes a theme color → one line of CSS changes.

No component re-renders. No state updates.

The DOM just looks different. Instantly.

CSS variables (default VLC dark theme):

  /* Core surfaces */

  --vlc-bg-base:         #1E1E1E

  --vlc-bg-surface:      #2A2A2A

  --vlc-bg-elevated:     #333333

  --vlc-bg-sunken:       #161616

  /* Borders */

  --vlc-border-subtle:   rgba(255,255,255,0.06)

  --vlc-border-normal:   rgba(255,255,255,0.12)

  --vlc-border-strong:   rgba(255,255,255,0.22)

  /* VLC Orange — the identity */

  --vlc-accent:          #FF8800

  --vlc-accent-hover:    #E67A00

  --vlc-accent-dim:      rgba(255,136,0,0.15)

  --vlc-accent-text:     #FFA033

  /* Text */

  --vlc-text-primary:    #F0F0F0

  --vlc-text-secondary:  rgba(240,240,240,0.65)

  --vlc-text-ghost:      rgba(240,240,240,0.35)

  --vlc-text-disabled:   rgba(240,240,240,0.20)

  /* Seek bar */

  --vlc-seek-played:     var(--vlc-accent)

  --vlc-seek-buffered:   rgba(255,255,255,0.28)

  --vlc-seek-track:      rgba(255,255,255,0.12)

  --vlc-seek-thumb:      #FFFFFF

  --vlc-chapter-marker:  rgba(255,255,255,0.45)

  /* Volume */

  --vlc-volume-fill:     #FFFFFF

  --vlc-volume-boost:    #FF4444

  /* Controls */

  --vlc-control-bg:      transparent

  --vlc-control-hover:   rgba(255,255,255,0.08)

  --vlc-control-active:  rgba(255,255,255,0.14)

  --vlc-control-radius:  6px

  /* Gradient */

  --vlc-gradient:        linear-gradient(

                           to top,

                           rgba(0,0,0,0.92) 0%,

                           rgba(0,0,0,0.55) 50%,

                           transparent 100%

                         )

  --vlc-gradient-height: 140px

  /* Typography */

  --vlc-font-ui:         "Inter", system-ui, sans-serif

  --vlc-font-mono:       "JetBrains Mono", monospace

  --vlc-font-size-sm:    12px

  --vlc-font-size-md:    13px

  --vlc-font-size-lg:    15px

  /* Radii */

  --vlc-radius-sm:       4px

  --vlc-radius-md:       8px

  --vlc-radius-lg:       12px

  --vlc-radius-full:     100px

  /* Shadows */

  --vlc-shadow-popup:    0 8px 32px rgba(0,0,0,0.6)

  --vlc-shadow-tooltip:  0 4px 16px rgba(0,0,0,0.5)

  /* Transitions */

  --vlc-transition-fast: 0.12s ease

  --vlc-transition-mid:  0.22s ease

  --vlc-transition-slow: 0.35s ease

BUILT-IN THEMES (6 presets, all using this system):

Theme 1 — VLC Classic (default):

  Exact VLC dark interface colors above

Theme 2 — VLC Light:

  --vlc-bg-base:        #F0F0F0

  --vlc-bg-surface:     #E4E4E4

  --vlc-text-primary:   #1A1A1A

  (accent stays #FF8800 — VLC brand is orange)

Theme 3 — Midnight Blue:

  --vlc-bg-base:        #0D1117

  --vlc-bg-surface:     #161B22

  --vlc-accent:         #58A6FF

Theme 4 — Forest:

  --vlc-bg-base:        #0F1A14

  --vlc-bg-surface:     #162019

  --vlc-accent:         #4CAF50

Theme 5 — Rose:

  --vlc-bg-base:        #1A0F14

  --vlc-bg-surface:     #22141A

  --vlc-accent:         #E91E8C

Theme 6 — Custom (fully user-defined):

  Every variable exposed in Settings → Appearance

  Color picker for each variable

  Live preview updates as colors are changed

Theme storage: localStorage "vlc-theme-vars"

  Stored as JSON map of variable names to values

  Applied on mount: Object.entries(saved).forEach(

    ([k,v]) => document.documentElement.style.setProperty(k,v)

  )

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXACT LAYOUT DIMENSIONS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

App fills 100vw × 100vh. Zero body margin.

html,body { margin:0; padding:0; 

            overflow:hidden; background:#000; }

┌────────────────────────────────────────────┐

│  TITLE BAR (height: 36px)                  │

│  bg: --vlc-bg-sunken                       │

├────────────────────────────────────────────┤

│  MENU BAR (height: 28px)                   │

│  bg: --vlc-bg-surface                      │

├────────────────────────────────────────────┤

│                                            │

│     VIDEO CANVAS (flex: 1)                 │

│     bg: #000000                            │

│                                            │

├────────────────────────────────────────────┤

│  SEEK BAR (height: 22px)                   │

│  padding: 0 12px                           │

│  bg: --vlc-bg-surface                      │

├────────────────────────────────────────────┤

│  CONTROLS (height: 60px)                   │

│  bg: --vlc-bg-surface                      │

├────────────────────────────────────────────┤

│  PLAYLIST PANEL (collapsible, default 220px│

│  from bottom)                              │

└────────────────────────────────────────────┘

Note: VLC has a DETACHED control bar — controls

are outside the video frame, not overlaid.

This is correct. This is intentional.

Controls live below the video.

They never disappear on inactivity.

Only in fullscreen do they overlay with auto-hide.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TITLE BAR (height: 36px)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bg: --vlc-bg-sunken

border-bottom: 1px solid --vlc-border-subtle

Left:

  VLC cone logo SVG (20px)

  Filename: "Big Buck Bunny.mp4"

  --vlc-font-ui, 12px, --vlc-text-secondary

  Truncated, max 60% width

Right (window controls):

  Minimize (−): 46×36px, hover rgba(255,255,255,0.08)

  Maximize (□): 46×36px, hover rgba(255,255,255,0.08)

  Close (×):   46×36px, hover #C42B1C

  Each: 1px vertical separator between them

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MENU BAR (height: 28px)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bg: --vlc-bg-surface

border-bottom: 1px solid --vlc-border-subtle

Menu items (flex row, height 28px):

"Media" "Playback" "Audio" "Video" "Subtitle"

"Tools" "View" "Help"

Each item:

  padding: 0 12px

  --vlc-font-ui, 12px, --vlc-text-secondary

  hover: bg --vlc-control-hover, color --vlc-text-primary

  active (open): bg --vlc-bg-elevated

Dropdown menus (exact VLC structure):

MEDIA dropdown:

  Open File...           (Ctrl+O)

  Open Folder...

  Open Disc...

  Open Network Stream... (Ctrl+N)

  ─────────────────────

  Recent Media     ▶ (submenu: last 10 files)

  ─────────────────────

  Save/Convert...

  ─────────────────────

  Quit             (Ctrl+Q)

PLAYBACK dropdown:

  Play / Pause           (Space)

  Stop

  ─────────────────────

  Previous               (P)

  Next                   (N)

  ─────────────────────

  Record

  ─────────────────────

  Speed

    Faster (fine)        (])

    Faster               (=)

    Normal Speed         (=)

    Slower               (-)

    Slower (fine)        ([)

  ─────────────────────

  Jump to Time...        (Ctrl+T)

  ─────────────────────

  Repeat One            ✓ (toggle)

  Repeat All            ✓ (toggle)

  Random               ✓ (toggle)

AUDIO dropdown:

  Audio Track      ▶

  Audio Device     ▶

  ─────────────────────

  Increase Volume        (Ctrl+↑)

  Decrease Volume        (Ctrl+↓)

  Mute                   (M)

  ─────────────────────

  Audio Delay +

  Audio Delay -

  ─────────────────────

  Equalizer...

  Compressor...

  Stereo Mode      ▶

    Stereo

    Reverse Stereo

    Left only

    Right only

    Dolby Surround

VIDEO dropdown:

  Video Track       ▶

  Zoom              ▶

    1:4  1:2  Original  2:1

  Aspect Ratio      ▶

    Default  1:1  4:3  16:9  16:10

    2.21:1  2.35:1  2.39:1  5:4

  Crop              ▶

    No Crop  16:10  16:9  1.85:1

    2.21:1   2.35:1  2.39:1  4:3  5:3

    5:4  Custom

  ─────────────────────

  Deinterlace       ▶

  Deinterlace Mode  ▶

  ─────────────────────

  Fullscreen         (F)

  Always on Top     ✓

SUBTITLE dropdown:

  Subtitle Track    ▶

  Add Subtitle File...  (Ctrl+Shift+O)

  ─────────────────────

  Subtitle Delay +

  Subtitle Delay -

  ─────────────────────

  Font Size         ▶ (Smaller/Normal/Larger/Largest)

  Subtitle Style    ▶

  ─────────────────────

  VLsub (Online subtitles)

TOOLS dropdown:

  Effects and Filters... (Ctrl+E)

  Track Synchronization...

  ─────────────────────

  Codec Information... (Ctrl+J)

  ─────────────────────

  Preferences...         (Ctrl+P)

VIEW dropdown:

  Playlist               (Ctrl+L)

  ─────────────────────

  Advanced Controls    ✓

  Status Bar           ✓

  ─────────────────────

  Full Screen            (F)

  Minimal View           (Ctrl+H)

Dropdown style:

  bg: --vlc-bg-elevated

  border: 1px solid --vlc-border-normal

  border-radius: var(--vlc-radius-sm)

  box-shadow: var(--vlc-shadow-popup)

  min-width: 220px

  padding: 4px 0

  Each item: height 26px, padding 0 24px

  --vlc-font-ui, 12px, --vlc-text-secondary

  hover: bg rgba(255,136,0,0.12), color --vlc-text-primary

  Keyboard shortcut: right-aligned, --vlc-text-ghost

  Separator: 1px --vlc-border-subtle, margin 4px 0

  Check mark: left side, 14px, --vlc-accent (✓)

  Submenu arrow: right side (▶)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SEEK BAR (height: 22px total)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bg: --vlc-bg-surface

padding: 0 12px

Track vertically centered:

  Default height: 4px

  Hover height:   6px

  Transition: height var(--vlc-transition-fast)

  border-radius: var(--vlc-radius-full)

Track layers:

  1. Background: --vlc-seek-track, 100%

  2. Buffered:   --vlc-seek-buffered

  3. Played:     --vlc-seek-played

  All layers: same height, same border-radius

Chapter markers (if media has chapters):

  1px wide, full track height

  color: --vlc-chapter-marker

  Tooltip on hover: chapter name + timestamp

Thumb:

  Default: 0px diameter (hidden)

  Hover:   12px diameter, --vlc-seek-thumb

  Dragging: 16px diameter (tactile feedback)

  border-radius: 50%

  Transform scale animation (0→1): 0.1s ease

  position: absolute, centered on track

Time preview on hover:

  Canvas: 160×90px (offscreen, always allocated)

  Position: above thumb, centered

  bg: --vlc-bg-elevated

  border: 1px solid --vlc-border-normal

  border-radius: var(--vlc-radius-sm)

  padding: 4px 4px 2px 4px

  

  Time label below canvas:

  JetBrains Mono, 11px, --vlc-text-primary, center

Chapter name (if at chapter boundary):

  Below time label

  --vlc-font-ui, 10px, --vlc-text-ghost

Frame-accurate seeking:

  mousedown → video.pause()

  mousemove → video.currentTime = target (direct)

  mouseup → if wasPlaying → video.play()

  No debounce during drag (frame-accurate is the point)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTROLS BAR (height: 60px)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bg: --vlc-bg-surface

border-top: 1px solid --vlc-border-subtle

padding: 0 12px

display: flex, align-items: center

Icon button base:

  width: 36px, height: 36px

  border-radius: var(--vlc-control-radius)

  bg: var(--vlc-control-bg)

  hover: bg var(--vlc-control-hover)

  active: bg var(--vlc-control-active)

  transition: background var(--vlc-transition-fast)

  cursor: pointer

LEFT GROUP:

1. STOP button

   Icon: square (■), 18×18px, --vlc-text-secondary

   Click: video.pause() + video.currentTime = 0

   Tooltip: "Stop (S)"

2. PREVIOUS button

   Icon: skip-back, 18×18px

   Tooltip: "Previous (P)"

   Playlist: go to previous track

   No playlist: seek to start

3. PLAY / PAUSE button (larger — the primary action)

   width: 44px, height: 44px

   Icon: 22×22px

   Play icon: right triangle

   Pause icon: two bars

   Tooltip: "Play (Space)" / "Pause (Space)"

   

   Center animation on click:

   Large icon (64×64px) appears center of video

   opacity 0→1→0 over 500ms, peak at 80ms

   bg: none — just the icon, white with shadow

4. NEXT button

   Icon: skip-forward, 18×18px

   Tooltip: "Next (N)"

DIVIDER: 1px --vlc-border-subtle, 20px height, margin 0 8px

5. REPEAT button

   States: OFF → REPEAT_ALL → REPEAT_ONE

   Icons change per state:

     OFF:        repeat icon, --vlc-text-ghost

     ALL:        repeat icon, --vlc-accent

     ONE:        repeat-1 icon, --vlc-accent

   Click: cycles through 3 states

   Tooltip: "Repeat: Off/All/One (L)"

6. RANDOM / SHUFFLE button

   Toggle: ON/OFF

   OFF: shuffle icon, --vlc-text-ghost

   ON:  shuffle icon, --vlc-accent

   Tooltip: "Random (R)"

CENTER (flex: 1, justify-content: center):

7. TIME DISPLAY — LEFT

   "0:00:00" format (always HH:MM:SS — VLC style)

   JetBrains Mono, 13px, --vlc-text-primary

   Click: toggles to remaining time "-1:23:45"

   Width: fixed 72px (never shifts layout)

8. [small spacer]

9. TIME DISPLAY — TOTAL

   "/ 1:23:45"

   JetBrains Mono, 13px, --vlc-text-ghost

RIGHT GROUP:

10. TELETEXT button

    Icon: teletext/TT icon, 18px, --vlc-text-ghost

    Tooltip: "Teletext"

11. FULLSCREEN button

    Icon: expand arrows, 18×18px

    IN fullscreen: collapse icon

    Tooltip: "Fullscreen (F)"

12. EXTENDED SETTINGS button

    Icon: sliders horizontal, 18×18px

    Opens Effects & Filters panel

    Tooltip: "Show extended settings (Ctrl+E)"

13. FRAME ADVANCE button (right of extended)

    Icon: step-forward, 18×18px

    Only visible when paused

    Click: advance exactly one frame

      video.currentTime += 1 / detectedFps

    Tooltip: "Next frame (E)"

    FPS detection: parsed from media stream info

    Fallback: 1/30 if FPS unknown

14. PLAYLIST TOGGLE button

    Icon: list icon, 18×18px

    Tooltip: "Playlist (Ctrl+L)"

    Toggles playlist panel

DIVIDER

15. VOLUME ICON

    States (4):

      0%:      speaker-x (muted)

      1–33%:   speaker-wave-1

      34–66%:  speaker-wave-2

      67–100%: speaker-wave-3

      > 100%:  speaker + orange tint (boost active)

    Click: toggle mute

    Scroll over icon: ±5% volume

    Tooltip: "Mute (M)" / "Unmute (M)"

16. VOLUME SLIDER

    Width: 80px

    Track height: 4px, hover: 5px

    Range: 0–200% (VLC goes to 200% — not 100%)

    0–100%: fill color --vlc-volume-fill

    100–200%: fill color --vlc-volume-boost (#FF4444)

    At 100% mark: a faint white tick (|)

    Thumb: 12px circle, white

    

    Boost zone note:

    When dragged into 100–200% range:

    Tooltip shows "Volume boost: 147%"

    Small warning pill appears:

    "⚠ Volume boost active"

    bg rgba(255,68,68,0.15), color #FF6B6B

    DM Sans 11px, fades after 2s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VIDEO CANVAS AREA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bg: #000000 (always pure black)

Flex: 1 (fills between menu bar and seek bar)

overflow: hidden

Video element:

  width: 100%, height: 100%

  object-fit: contain (VLC default — letterbox)

  Changeable to: cover/fill/stretch via Video menu

Click: toggle play/pause

Double click: toggle fullscreen

Right click: context menu (same as menu bar items)

Mouse wheel over canvas:

  Scroll up:   Volume +5%

  Scroll down: Volume -5%

  Ctrl+scroll: Zoom in/out

DOUBLE CLICK SEEK ZONES (configurable):

  Left 25%: seek -10s (ripple: "◀◀ 10s")

  Right 25%: seek +10s (ripple: "10s ▶▶")

  Center 50%: fullscreen toggle

SUBTITLE OVERLAY:

  position: absolute, bottom: 10%, width: 100%

  text-align: center

  color: white

  font-size: user configurable (default 18px)

  font-family: user configurable (default Arial)

  text-shadow: 2px 2px 4px #000, -2px -2px 4px #000

  background: user configurable (default transparent)

  Rendered via <track> if VTT, custom render if SRT/ASS

OSD (On Screen Display):

  All notifications: top-left (VLC default — not center)

  bg: rgba(0,0,0,0.65)

  border-radius: var(--vlc-radius-sm)

  padding: 6px 12px

  --vlc-font-ui, 13px, white

  Fade out after 1.5s

  

  Messages:

    "Volume: 75%" (with mini bar)

    "Speed: 1.50×"

    "Seeking to 12:34"

    "Subtitle delay: +500ms"

    "Audio delay: -200ms"

    "A-B loop: A=1:23"

    "A-B loop: B=4:56 (looping)"

    "A-B loop: cleared"

CONTEXT MENU (right-click on video):

  Same items as menu bar dropdowns

  bg: --vlc-bg-elevated, same dropdown style

  Appears at cursor position, clips to viewport

ZOOM OVERLAY (when zoom > 100%):

  video transform: scale(zoomFactor)

  transform-origin: center center

  Keyboard: Numpad +/- to zoom

  Reset: Numpad * or double-click with zoom tool

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PLAYLIST PANEL (collapsible, default open)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Slides up from bottom:

  Default height: 220px

  Resizable: drag top border (min 120px, max 50vh)

  Hidden: height 0 (transition 0.25s ease)

Header (height: 36px):

  bg: --vlc-bg-elevated

  border-top: 1px solid --vlc-border-subtle

  

  Left: "Playlist" --vlc-font-ui 12px --vlc-text-secondary

  Right: icon buttons (24×24px each):

    "Save playlist"

    "Clear all"

    "Randomize"

    Close (×)

Column headers (height: 28px):

  "#" · "Title" · "Duration"

  --vlc-font-ui, 11px, --vlc-text-ghost

  border-bottom: 1px solid --vlc-border-subtle

Playlist items (height: 30px each):

  display: flex, align-items: center

  padding: 0 8px, gap: 8px

  cursor: pointer

  

  Index: JetBrains Mono, 11px, --vlc-text-ghost

         min-width: 24px, right-aligned

  

  Title: --vlc-font-ui, 12px, --vlc-text-secondary

         truncated with ellipsis

         flex: 1

  

  Duration: JetBrains Mono, 11px, --vlc-text-ghost

            min-width: 56px, right-aligned

  

  Hover: bg rgba(255,255,255,0.04)

  

  Active (now playing):

    Left border: 2px solid --vlc-accent

    bg: var(--vlc-accent-dim)

    Title: --vlc-text-primary, font-weight 500

    Animated equalizer bars icon left of title:

      3 bars, each pulsing at different heights

      color: --vlc-accent

  

  Right-click context menu per item:

    "Play"

    "Remove from Playlist"

    "Properties" (shows file path + codec)

Drag and drop:

  Files dragged onto playlist → add to list

  Items dragged within playlist → reorder

  Drag target indicator: 2px --vlc-accent line

  between items

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FULLSCREEN MODE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fullscreen API: document.documentElement

  .requestFullscreen()

In fullscreen:

  Title bar: HIDDEN

  Menu bar: HIDDEN

  Video: fills 100vw × 100vh

  

  FLOATING CONTROL BAR (bottom overlay):

    Position: absolute, bottom: 0, width: 100%

    bg: --vlc-gradient

    Gradient height: --vlc-gradient-height

    Contains: seek bar + full controls row

    (same content as regular controls, 

     same exact layout)

  

  Auto-hide: 3000ms after last mouse move

    Controls fade out: opacity 1→0, 0.4s

    Cursor: none when controls hidden

    NEVER hide when paused

    NEVER hide when hovering controls

    NEVER hide when any popup open

  

  Mouse move: controls instantly reappear

    opacity 0→1, 0.2s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EFFECTS & FILTERS PANEL (Ctrl+E)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A floating panel, NOT a modal (it can stay open

while the video plays — this is critical for VLC).

Position: right side of window, 320px from right

          vertically centered to available space

Width: 320px

bg: --vlc-bg-elevated

border: 1px solid --vlc-border-normal

border-radius: var(--vlc-radius-md)

box-shadow: var(--vlc-shadow-popup)

Draggable by header

Header: "Adjustments and Effects"

  --vlc-font-ui, 13px, --vlc-text-primary, 500 weight

  Close button (×)

TABS (5 tabs matching VLC exactly):

  "Video Effects" | "Audio Effects" | "Synchronization"

  Tab indicator: 2px bottom border --vlc-accent

  --vlc-font-ui, 12px

── VIDEO EFFECTS TAB ───────────────────────────

Sub-tabs: "Basic" | "Crop" | "Colors" | "Geometry"

           "Advanced" | "Overlay"

BASIC sub-tab:

  Image adjust toggle (checkbox, active: orange)

  When active:

  

  Hue:         -180 → +180  (default 0°)

  Saturation:    0  →  3.0  (default 1.0)

  Contrast:      0  →  2.0  (default 1.0)

  Brightness:    0  →  2.0  (default 1.0)

  Gamma:       0.01 →  10   (default 1.0)

  

  All: horizontal sliders

  Slider style:

    Track height: 3px, --vlc-border-strong

    Fill: --vlc-accent

    Thumb: 14px circle, white

    Value: shown right of slider (JetBrains Mono 11px)

  

  Applied via CSS filter on video element:

    filter: hue-rotate({hue}deg) 

            saturate({sat}) 

            contrast({con}) 

            brightness({bri})

            gamma handled via SVG feComponentTransfer

  

  "Reset all" link: bottom, --vlc-accent, 12px

COLORS sub-tab:

  RGB curves (canvas-based curve editor):

    Click + drag on curve

    Master / Red / Green / Blue channels

    Colors:

      Master: white, Red: #FF4444,

      Green: #44FF44, Blue: #4444FF

  

  Color balance sliders:

    Red: 0–255 (default 128)

    Green: 0–255 (default 128)

    Blue: 0–255 (default 128)

GEOMETRY sub-tab:

  Transform:

    Rotate: -180° → +180° (slider + input)

    Zoom: 0 → 500% (slider)

    X offset: -200 → +200 (pixel offset)

    Y offset: -200 → +200

  Flip:

    Horizontal flip toggle

    Vertical flip toggle

── AUDIO EFFECTS TAB ───────────────────────────

Sub-tabs: "Equalizer" | "Compressor" | "Spatializer"

           "Stereo Widener" | "Pitch Adjuster"

EQUALIZER sub-tab:

  Enable toggle (checkbox)

  

  Preset selector (dropdown, 18 presets):

    Flat, Classical, Club, Dance, Full Bass,

    Full Bass & Treble, Full Treble, Headphones,

    Large Hall, Live, Party, Pop, Reggae,

    Rock, Ska, Soft, Soft Rock, Techno, Custom

  

  Preamp slider: -20dB → +20dB (default 0)

    Shows: "Preamp: 6.0 dB"

  

  10-band EQ (vertical sliders):

    Frequencies: 60Hz, 170Hz, 310Hz, 600Hz, 1kHz,

                 3kHz, 6kHz, 12kHz, 14kHz, 16kHz

    Range: -20dB → +20dB

    Each: vertical, height 120px

    Frequency label below each (--vlc-font-mono 9px)

    dB value above each slider (--vlc-font-mono 10px)

    Active fill: --vlc-accent

    

    Web Audio API implementation:

      AudioContext → MediaElementSource →

      10× BiquadFilterNode (type: "peaking") →

      GainNode (preamp) → destination

      

      Each filter:

      frequency: [60,170,310,600,1000,3000,

                  6000,12000,14000,16000]

      type: "peaking"

      Q: 1.0

      gain: slider value in dB

    

    All nodes connected on first enable.

    Disconnected on disable (bypass — zero latency).

    Nodes persisted across track changes.

COMPRESSOR sub-tab:

  Enable toggle

  

  Threshold: -60 → 0 dB (default -24)

  Knee:        0 → 40 dB (default 30)

  Ratio:       1 → 20    (default 12)

  Pre-gain:  -40 → 40 dB (default 0)

  Post-gain: -40 → 40 dB (default 0)

  Attack:    0.001 → 1 sec (default 0.003)

  Release:   0.001 → 1 sec (default 0.25)

  

  Web Audio: DynamicsCompressorNode

  

  Gain reduction meter: vertical, realtime

  Updates at 15fps (not 60fps — compressor

  values change slowly enough that 15fps looks fine

  and saves meaningful CPU on long sessions)

PITCH ADJUSTER sub-tab:

  Pitch shift: -12 → +12 semitones

  JetBrains Mono 13px value display

  Implemented via: AudioWorklet with pitch

  shifting algorithm (PSOLA / phase vocoder)

  

  Note: display disclaimer below slider:

  "Pitch shifting may introduce audio artifacts

   on complex material."

  (This is honest. Users deserve to know.)

── SYNCHRONIZATION TAB ─────────────────────────

Audio/Video delay (sync):

  Audio delay: -5000ms → +5000ms

  Shown as: "+320 ms"

  Adjusted with: ↑↓ keys when field focused

  OR keyboard shortcut J/K

  

Subtitle delay:

  Same range and display

  Adjusted with: H/G keys (VLC defaults)

FPS detection display:

  "Detected: 23.976 fps"

  JetBrains Mono 11px --vlc-text-ghost

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PREFERENCES PANEL (Ctrl+P)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Position: centered modal

Width: 680px, Height: 560px

bg: --vlc-bg-elevated

border: 1px solid --vlc-border-normal

border-radius: var(--vlc-radius-lg)

box-shadow: var(--vlc-shadow-popup)

LEFT SIDEBAR (200px):

  Category list (nav items):

    Interface

    Audio

    Video

    Subtitles / OSD

    Input / Codecs

    Hotkeys

    Appearance

  

  Each: height 34px, padding 0 16px

  --vlc-font-ui, 13px, --vlc-text-secondary

  Hover: bg rgba(255,255,255,0.04)

  Active: bg --vlc-accent-dim,

          color --vlc-text-primary,

          border-left 2px --vlc-accent

RIGHT CONTENT (flex: 1, padding: 24px, scrollable):

── INTERFACE ───────────────────────────────────

Language: dropdown (English, Hindi, + others)

Playlist: 

  "Start playing on first item" toggle

  "Continue last playlist on start" toggle

  "Single instance mode" toggle

  "Show album art" toggle

── AUDIO ────────────────────────────────────────

Default volume: 0–200% slider

Normalize volume: toggle + level slider (0.1–10)

Audio output module: "WebAudio (default)"

Stereo mode: dropdown

  Stereo / Mono / Left only / Right only /

  Reverse stereo / Dolby / Headphones

Audio language preference: text input

  "en,hi" (comma-separated ISO codes)

── VIDEO ─────────────────────────────────────────

Default aspect ratio: dropdown

  Default / 1:1 / 4:3 / 16:9 / 16:10 /

  2.21:1 / 2.35:1 / 2.39:1 / 5:4

Default zoom: dropdown

  1:4 / 1:2 / fit / 1:1 / 2:1

Deinterlace: dropdown (Off/Automatic/Blend...)

Hardware acceleration: toggle (default ON)

Snapshot format: PNG / JPG / WebP

Snapshot directory: text (defaults to Downloads)

Snapshot prefix: text (default "vlc-snap")

── SUBTITLES / OSD ──────────────────────────────

Enable subtitles by default: toggle

Subtitle language: text input

  "en,hi" (comma-separated)

Subtitle encoding: dropdown (UTF-8 / Latin-1 / ...)

Force subtitle position: toggle

Position: -100 (top) → 100 (bottom) slider

Font family:

  Dropdown: Arial, Helvetica, Times New Roman,

  Courier New, Verdana, Georgia, Impact,

  JetBrains Mono, Custom...

  

Font size: 12 → 72 (slider + number input)

Font color: COLOR PICKER (full HSL picker)

  Shows hex value, allows typing hex

  Palette: 8 common colors for quick pick

Font opacity: 0–100%

Font bold: toggle

Font italic: toggle

Outline color: COLOR PICKER

Outline thickness: 0 → 10 (slider)

Background color: COLOR PICKER

Background opacity: 0–100%

OSD (On-Screen Display):

  Show OSD: toggle

  OSD position: dropdown

    Top-left / Top-center / Top-right /

    Center / Bottom-left / Bottom-center / Bottom-right

  OSD duration: 500ms → 5000ms (slider)

  OSD font size: 10 → 24 (slider)

  OSD opacity: 0–100%

── HOTKEYS ──────────────────────────────────────

Complete keyboard shortcut remapping.

Table with 2 columns: Action | Key binding

All VLC default shortcuts:

  Action                    Default Key

  ────────────────────────────────────────────

  Play/Pause                Space

  Stop                      S

  Next                      N

  Previous                  P

  Faster                    =

  Slower                    -

  Faster (fine)             ]

  Slower (fine)             [

  Normal speed              =

  Volume up                 Ctrl+↑

  Volume down               Ctrl+↓

  Mute                      M

  Jump +10s                 L  (or →)

  Jump -10s                 J  (or ←)

  Jump +60s                 Ctrl+→

  Jump -60s                 Ctrl+←

  Jump +300s                Alt+→

  Jump -300s                Alt+←

  Fullscreen                F

  Aspect ratio              A

  Zoom                      Z

  Subtitle delay +          H

  Subtitle delay -          G

  Audio delay +             K

  Audio delay -             J  [conflict — user resolves]

  Frame advance             E

  Next audio track          B

  Next subtitle track       V

  Screenshot                Ctrl+Alt+S

  Playlist                  Ctrl+L

  Equalizer                 Ctrl+E

  Preferences               Ctrl+P

  

  Each row: click key binding cell → "Press any key"

  New key registered → validates for conflicts

  Conflict: shows warning "Already used by: {action}"

  User chooses: keep both / override

── APPEARANCE ────────────────────────────────────

THIS IS THE CUSTOM THEME SECTION.

Theme preset selector:

  6 theme cards in a 2×3 grid

  Each: 120×70px preview (mini player mock)

  Active: border 2px --vlc-accent

  Click: applies theme instantly (CSS vars update)

  Themes: Classic / Light / Midnight / Forest / Rose / Custom

Custom theme section (visible when Custom selected):

  

  Scrollable list of ALL CSS variables with:

  - Variable name (JetBrains Mono 11px --vlc-text-ghost)

  - Visual label (--vlc-font-ui 13px)

  - Color picker (for color vars)

    Full HSL picker + hex input + opacity

    Eyedropper (if browser supports EyeDropper API)

  - Slider (for numeric vars like font sizes)

  - Live preview: changes apply as user drags

  

  Grouped sections:

    "Surfaces" (bg vars)

    "Borders"

    "Accent Color"

    "Text Colors"

    "Seek Bar"

    "Volume"

    "Controls"

    "Typography"

    "Spacing"

    "Shadows"

  

  Export theme: "Copy as JSON"

  Import theme: "Paste JSON" → validates + applies

  Reset to default: resets all vars to defaults

Save button: writes to localStorage

Cancel: discards changes (reverts live preview)

Apply: saves without closing panel

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A-B LOOP FEATURE (VLC signature feature)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Press L (or hotkey): cycles through 3 states:

  State 0: No loop (default)

  State 1: A set (OSD: "A-B loop: A=1:23")

  State 2: B set, looping (OSD: "A-B loop: B=4:56")

  Press again: clears (OSD: "A-B loop: cleared")

Visual indicator on seek bar:

  A marker: vertical 3px orange line at A position

  B marker: vertical 3px orange line at B position

  A-B region: orange overlay between A and B,

    opacity: 0.2, bg: --vlc-accent

Loop behavior:

  When currentTime >= B: seek back to A

  Implemented in rAF loop (not onTimeUpdate)

  for precise loop boundary

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CODEC INFORMATION PANEL (Ctrl+J)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Floating panel (same style as Effects panel)

Width: 400px

Content extracted from HTMLVideoElement:

  File name: truncated

  File path/URL: full path, selectable text

  

  Video track:

    Codec: (from MediaSource or filename heuristic)

    Resolution: video.videoWidth × video.videoHeight

    Display Aspect Ratio: calculated

    Frame rate: detected (via frame counting)

    Bitrate: estimated from file size / duration

  

  Audio track:

    Codec: detected

    Sample rate: from AudioContext.sampleRate

    Channels: 2 (stereo) / 1 (mono)

    Bitrate: estimated

  

  Duration: formatted HH:MM:SS.mmm

  File size: formatted MB/GB (if local file)

  

  All values: JetBrains Mono 12px, selectable

  Labels: --vlc-font-ui 12px --vlc-text-ghost

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALL KEYBOARD SHORTCUTS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Registered via document.addEventListener outside React.

All re-mappable via Preferences → Hotkeys.

Stored in localStorage "vlc-hotkeys" as JSON.

Default bindings:

Space         → Play/Pause

S             → Stop

N             → Next track

P             → Previous track

F             → Fullscreen toggle

M             → Mute toggle

E             → Frame advance (when paused)

R             → Random toggle

L             → A-B Loop cycle

A             → Cycle aspect ratio

Z             → Cycle zoom

B             → Next audio track

V             → Next subtitle track

←             → Seek -10s

→             → Seek +10s

Ctrl+←        → Seek -60s

Ctrl+→        → Seek +60s

Alt+←         → Seek -300s

Alt+→         → Seek +300s

↑             → Volume +5%

↓             → Volume -5%

Ctrl+↑        → Volume +5% (alt)

Ctrl+↓        → Volume -5% (alt)

0-9           → Seek 0-90%

[             → Speed -0.25×

]             → Speed +0.25×

=             → Speed reset 1.0×

J             → Audio delay -50ms

K             → Audio delay +50ms

G             → Subtitle delay -50ms

H             → Subtitle delay +50ms

T             → Toggle time display (elapsed/remaining)

Ctrl+O        → Open file

Ctrl+N        → Open network URL

Ctrl+L        → Toggle playlist

Ctrl+E        → Effects & Filters panel

Ctrl+P        → Preferences

Ctrl+J        → Codec information

Ctrl+T        → Jump to time dialog

Ctrl+Alt+S    → Screenshot

Ctrl+Q        → Quit (close app)

?             → Keyboard help overlay

? key shows a two-column panel of ALL shortcuts,

styled like the Preferences panel.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PERSISTENCE (localStorage)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All keys prefixed "vlc-player-"

Volume:            "vlc-player-volume"      → 0.0–2.0

Muted:             "vlc-player-muted"       → boolean

Speed:             "vlc-player-speed"       → number

Position per file: "vlc-player-pos-{hash}" → seconds

  hash: btoa(src).slice(0,16)

  Resumes on reload

  Cleared when last 3% reached (considered done)

Playlist:          "vlc-player-playlist"   → array

Last files (10):   "vlc-player-recent"     → array

Repeat mode:       "vlc-player-repeat"     → 0/1/2

Random mode:       "vlc-player-random"     → boolean

EQ settings:       "vlc-player-eq"         → object

EQ enabled:        "vlc-player-eq-on"      → boolean

Compressor:        "vlc-player-comp"       → object

All preferences:   "vlc-player-prefs"      → object

Theme:             "vlc-theme-vars"         → object

Hotkeys:           "vlc-hotkeys"            → object

Panel sizes:       "vlc-player-panels"     → object

  (playlist height, panel positions)

Subtitle style:    "vlc-player-sub-style"  → object

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPEN NETWORK STREAM DIALOG (Ctrl+N)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Centered modal, width: 480px

Title: "Open Media"

Tabs: "File" | "Disc" | "Network" | "Capture"

NETWORK tab:

  Label: "Please enter a network URL:"

  Input (full width, height 44px):

    placeholder: "https:// or rtsp:// or mms://"

    --vlc-font-mono, 13px

    focus: border --vlc-accent

  

  Recent URLs (below input):

  Dropdown of last 10 opened URLs

  

  "Play" button: bg --vlc-accent, full orange

  "Cancel": ghost

JUMP TO TIME DIALOG (Ctrl+T):

  Modal width: 280px

  Title: "Jump to Time"

  

  Time input: "HH:MM:SS"

  Each unit: separate input box

  JetBrains Mono 18px, white

  bg: --vlc-bg-sunken

  Auto-advance on 2-digit entry

  

  "Go" button + "Cancel"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCREENSHOT FEATURE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ctrl+Alt+S:

  1. Draw current video frame to offscreen canvas

     (same resolution as video.videoWidth × videoHeight)

  2. canvas.toBlob() in user-set format (PNG/JPG/WebP)

  3. Create object URL → trigger download

  4. Filename: "{prefix}-{YYYY-MM-DD}-{HH-MM-SS}.{ext}"

     prefix from preferences (default "vlc-snap")

  5. OSD: "Snapshot taken: vlc-snap-2024-05-04-14-32-11.png"

  6. Flash animation: white overlay on video

     opacity 0.4→0 over 200ms (camera flash feel)

  

  Revoke object URL after 60s (memory hygiene)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPONENT ARCHITECTURE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/src

  /components

    /layout

      TitleBar.tsx             ← App title bar 36px

      MenuBar.tsx              ← Menu bar 28px

      AppLayout.tsx            ← Root layout

    /menubar

      MediaMenu.tsx            ← Media dropdown

      PlaybackMenu.tsx         ← Playback dropdown

      AudioMenu.tsx            ← Audio dropdown

      VideoMenu.tsx            ← Video dropdown

      SubtitleMenu.tsx         ← Subtitle dropdown

      ToolsMenu.tsx            ← Tools dropdown

      ViewMenu.tsx             ← View dropdown

      MenuDropdown.tsx         ← Reusable dropdown

    /video

      VideoCanvas.tsx          ← <video> + overlays

      SubtitleOverlay.tsx      ← Subtitle renderer

      OSDDisplay.tsx           ← Top-left notifications

      ContextMenu.tsx          ← Right-click menu

      ClickZones.tsx           ← Seek zones

    /seekbar

      SeekBar.tsx              ← Full seek bar

      SeekTrack.tsx            ← Track layers

      SeekThumb.tsx            ← Scrubber

      TimePreview.tsx          ← Hover thumbnail

      ChapterMarkers.tsx       ← Chapter ticks

      ABLoopMarkers.tsx        ← A-B region overlay

    /controls

      ControlBar.tsx           ← 60px controls

      StopButton.tsx

      PlayPauseButton.tsx      ← Primary control

      PrevNextButtons.tsx

      RepeatButton.tsx

      RandomButton.tsx

      TimeDisplay.tsx          ← HH:MM:SS display

      TeletextButton.tsx

      FullscreenButton.tsx

      ExtendedSettingsButton.tsx

      FrameAdvanceButton.tsx

      PlaylistToggleButton.tsx

      VolumeControl.tsx        ← Icon + slider

      BoostWarning.tsx         ← >100% warning

    /playlist

      PlaylistPanel.tsx        ← Collapsible panel

      PlaylistItem.tsx         ← Single row

      PlaylistHeader.tsx       ← Panel header

    /panels

      EffectsPanel.tsx         ← Floating panel

      VideoEffectsTab.tsx      ← Video adjustments

      AudioEffectsTab.tsx      ← EQ + compressor

      SyncTab.tsx              ← A/V sync delays

      PreferencesPanel.tsx     ← Settings modal

      CodecInfoPanel.tsx       ← File codec info

    /preferences

      InterfacePrefs.tsx

      AudioPrefs.tsx

      VideoPrefs.tsx

      SubtitlePrefs.tsx

      HotkeysPrefs.tsx

      AppearancePrefs.tsx

      ThemeCard.tsx

      ColorPickerField.tsx     ← Full HSL picker

      HotkeyRow.tsx            ← Remappable key row

    /equalizer

      EQBandSlider.tsx         ← Single vertical band

      EQPresetSelector.tsx

      EQPreampSlider.tsx

    /dialogs

      OpenNetworkDialog.tsx

      JumpToTimeDialog.tsx

      KeyboardHelpOverlay.tsx

  /hooks

    useVideoPlayer.ts          ← Core video state

    usePlaylist.ts             ← Playlist management

    useKeyboardShortcuts.ts    ← Outside React

    useVolumeControl.ts        ← Volume + boost

    useSeekBar.ts              ← rAF seek tracking

    useABLoop.ts               ← A-B loop state

    useSubtitles.ts            ← SRT/VTT/ASS parser

    useAudioEqualizer.ts       ← Web Audio API chain

    useCompressor.ts           ← DynamicsCompressor

    useVideoFilters.ts         ← CSS filter chain

    useFullscreen.ts           ← Fullscreen API

    useControlVisibility.ts    ← Fullscreen auto-hide

    useRecentFiles.ts          ← localStorage history

    useTheme.ts                ← CSS var management

    useHotkeys.ts              ← Custom key map

    useFileHandler.ts          ← Drop + open file

    useScreenshot.ts           ← Canvas capture

  /store

    playerStore.ts             ← Zustand (all state)

  /audio

    AudioGraph.ts              ← Web Audio node graph

    Equalizer.ts               ← 10-band EQ class

    Compressor.ts              ← DynamicsCompressor

    PitchShifter.ts            ← AudioWorklet

  /utils

    formatTime.ts              ← "1:23:45"

    formatBytes.ts             ← "847 MB"

    subtitleParser.ts          ← SRT/VTT/ASS parser

    thumbnailExtractor.ts      ← Frame canvas capture

    fpsDetector.ts             ← Frame rate detection

    codecDetector.ts           ← Media info extraction

    themeManager.ts            ← CSS var apply/save

    hotkeyManager.ts           ← Key binding CRUD

    playlistManager.ts         ← Playlist operations

  /workers

    pitchShifter.worklet.ts    ← AudioWorklet pitch

  /types

    player.types.ts

    playlist.types.ts

    subtitle.types.ts

    theme.types.ts

    hotkey.types.ts

    audio.types.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DEMO SETUP

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

App fills 100vw × 100vh.

Default bg: #000000

Playlist pre-loaded with 3 public domain videos:

  1. Big Buck Bunny

     https://commondatastorage.googleapis.com/

     gtv-videos-bucket/sample/BigBuckBunny.mp4

     Duration: 9:56

  2. Elephant Dream

     https://commondatastorage.googleapis.com/

     gtv-videos-bucket/sample/ElephantsDream.mp4

     Duration: 10:54

  3. Tears of Steel

     https://commondatastorage.googleapis.com/

     gtv-videos-bucket/sample/TearsOfSteel.mp4

     Duration: 12:14

First video loads and pauses (not autoplaying —

autoplay requires user gesture).

Welcome message in video area (before first play):

"Drop a video file here or press Ctrl+O to open"

--vlc-font-ui 14px --vlc-text-ghost, centered

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DELIVER THIS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every file. Completely implemented.

rAF loop for seek bar. Not onTimeUpdate.

Web Audio graph for EQ. Not CSS only.

All menus open with correct items.

All preferences persist and apply.

Theme changes apply instantly to CSS vars.

Hotkeys are remappable.

A-B loop works frame-accurately.

Screenshot downloads with correct filename.

Playlist persists across page reload.

Subtitle delay adjusts rendering in real-time.

No TODOs.

No stubs.

No "// implement later".

Two years of work. Every feature ships.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://girish09.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/98adab7d-d8ab-4d9d-9d5d-54df15125e29).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
