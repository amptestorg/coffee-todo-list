# Coffee — Tasks

A warm, cozy todo list. Local-first (everything lives in your browser),
ships as a static site, and instruments product analytics via Amplitude.

## Stack

- **React 19 + TypeScript** via Vite
- **Tailwind CSS** with a hand-crafted espresso/caramel/cream palette
- **Framer Motion** for spring animations
- **lucide-react** icons (`Coffee` lockup!)
- **localStorage** for persistence — no backend required
- **Amplitude all-in-one SDK** — autocapture, session replay, and Experiment
- Design system generated with the
  [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) skill
  (warm earth tones + dark roast cinema)

## Features

- Add / edit / complete / delete tasks with smooth spring animations
- Priority (low / medium / high) with color-coded indicators
- Inline tag support (`#focus, deep-work`)
- Search + filter (All / Active / Done) + tag chips
- Animated "Today's brew" progress bar
- ⌘K / Ctrl+K to focus the input
- Ambient steam blobs behind the surface
- All task data lives in `localStorage`

## Amplitude instrumentation

The Amplitude all-in-one SDK is initialized in `src/lib/analytics.ts` with the
project's API key. Enabled:

- **Autocapture** — attribution, file downloads, form interactions, page views,
  sessions, element interactions, frustration interactions, network tracking,
  web vitals, performance tracking, page URL enrichment (all on)
- **Session Replay plugin** with `sampleRate: 1` (100% of sessions)
- **Experiment client** (`Experiment.initializeWithAmplitudeAnalytics`) so flag
  exposures flow into the same Amplitude project

Custom events emitted by the app:

| Event | When |
| --- | --- |
| `App Loaded` | On mount (and when todo count changes) |
| `Todo Added` | New task added (`priority`, `tag_count`) |
| `Todo Toggled` | Task completed / un-completed |
| `Todo Edited` | Title or other field changed |
| `Todo Removed` | Task deleted |
| `Filter Changed` | All / Active / Done switched |
| `Tag Filter Changed` | Tag chip clicked |
| `Completed Cleared` | "Clear done" pressed |

Use `getVariant('your-flag-key')` from `analytics.ts` anywhere in the app to
read a flag value.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the prod build locally
```

## Deploy to Vercel

This repo includes `vercel.json` with the right Vite settings. Two options:

**From the dashboard**

1. Push this repo to GitHub.
2. In Vercel, click **Add New → Project**, import the repo.
3. Framework Preset auto-detects as Vite. Build/output are already correct.
4. Click Deploy.

**From the CLI**

```bash
npm i -g vercel
vercel       # follow prompts
vercel --prod
```

No environment variables are required — the Amplitude key is embedded as a
public client-side write key.

## Project layout

```
src/
├── App.tsx                 # composition + event tracking wrappers
├── types.ts                # Todo, Priority, Filter
├── hooks/useTodos.ts       # state, persistence, derived stats
├── lib/
│   ├── storage.ts          # localStorage read/write + seed
│   └── analytics.ts        # Amplitude init, track(), getVariant()
└── components/
    ├── AmbientBackground.tsx
    ├── Header.tsx
    ├── AddTodoBar.tsx
    ├── FilterBar.tsx
    ├── TodoItem.tsx
    └── EmptyState.tsx
```
