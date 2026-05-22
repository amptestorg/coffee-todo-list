import * as amplitude from '@amplitude/analytics-browser'
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser'
import { Experiment } from '@amplitude/experiment-js-client'
import type { ExperimentClient } from '@amplitude/experiment-js-client'

const API_KEY = '789d9ad0828f3feb9c34e9e6a879abc2'

let experimentClient: ExperimentClient | null = null
let experimentReady = false
let initialized = false
let readyPromise: Promise<void> | null = null
const readyListeners = new Set<() => void>()

function markReady() {
  if (experimentReady) return
  experimentReady = true
  readyListeners.forEach((l) => l())
  readyListeners.clear()
}

export async function initAnalytics() {
  if (readyPromise) return readyPromise
  if (initialized) return
  initialized = true

  readyPromise = (async () => {
    amplitude.add(sessionReplayPlugin({ sampleRate: 1 }))

    await amplitude.init(API_KEY, {
      autocapture: {
        attribution: true,
        fileDownloads: true,
        formInteractions: true,
        pageViews: true,
        sessions: true,
        elementInteractions: true,
        frustrationInteractions: true,
        networkTracking: true,
        webVitals: true,
        performanceTracking: true,
        pageUrlEnrichment: true,
      },
    }).promise

    experimentClient = Experiment.initializeWithAmplitudeAnalytics(API_KEY)
    try {
      await experimentClient.start()
    } finally {
      markReady()
    }
  })()

  return readyPromise
}

export function track(eventName: string, eventProperties?: Record<string, unknown>) {
  amplitude.track(eventName, eventProperties)
}

export function isExperimentReady() {
  return experimentReady
}

export function onExperimentReady(listener: () => void): () => void {
  if (experimentReady) {
    listener()
    return () => {}
  }
  readyListeners.add(listener)
  return () => readyListeners.delete(listener)
}

/**
 * Read a flag's variant value.
 *
 * Returns `null` until the Experiment client has finished loading flags
 * (or has failed to load — see `isExperimentReady`). Callers should treat
 * `null` as "not yet known" and avoid making a gating decision until then.
 *
 * The legacy `fallback` argument is preserved for code paths that genuinely
 * have no async-aware UI to gate behind readiness — but new gating code
 * should branch on `isExperimentReady()` first.
 */
export function getVariant(flagKey: string, fallback: string | null = null): string | null {
  if (!experimentClient || !experimentReady) return fallback
  return experimentClient.variant(flagKey).value ?? fallback
}

export function getExperiment() {
  return experimentClient
}
