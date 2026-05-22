import * as amplitude from '@amplitude/analytics-browser'
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser'

const API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY ?? '789d9ad0828f3feb9c34e9e6a879abc2'

let initialized = false
let readyPromise: Promise<void> | null = null

export async function initAnalytics() {
  if (readyPromise) return readyPromise
  if (initialized) return
  initialized = true

  readyPromise = (async () => {
    try {
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
    } catch (error) {
      console.warn('[analytics] Failed to initialize Amplitude client', error)
    }
  })()

  return readyPromise
}

export function track(eventName: string, eventProperties?: Record<string, unknown>) {
  amplitude.track(eventName, eventProperties)
}
