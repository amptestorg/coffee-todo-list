import * as amplitude from '@amplitude/analytics-browser'
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser'
import { Experiment } from '@amplitude/experiment-js-client'
import type { ExperimentClient } from '@amplitude/experiment-js-client'

const API_KEY = '789d9ad0828f3feb9c34e9e6a879abc2'

let experimentClient: ExperimentClient | null = null
let initialized = false

export async function initAnalytics() {
  if (initialized) return
  initialized = true

  amplitude.add(
    sessionReplayPlugin({
      sampleRate: 1,
    }),
  )

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
  await experimentClient.start()
}

export function track(eventName: string, eventProperties?: Record<string, unknown>) {
  amplitude.track(eventName, eventProperties)
}

export function getVariant(flagKey: string, fallback = 'control'): string {
  if (!experimentClient) return fallback
  return experimentClient.variant(flagKey).value ?? fallback
}

export function getExperiment() {
  return experimentClient
}
