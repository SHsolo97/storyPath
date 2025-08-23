// Lightweight analytics/crash placeholders for Sprint 1-2
// Swap with real SDKs (e.g., Sentry/Firebase) in later sprints

type Event = { name: string; props?: Record<string, any> }

export const Analytics = {
  init(env: 'dev' | 'prod') {
    // no-op for now; gate noisy logs in prod
    if (env === 'dev') console.log('[analytics] init dev')
  },
  track({ name, props }: Event) {
    if (__DEV__) console.log(`[analytics] ${name}`, props ?? {})
  }
}

export const Crash = {
  init(env: 'dev' | 'prod') {
    if (env === 'dev') console.log('[crash] init dev')
  },
  capture(e: unknown, context?: Record<string, any>) {
    if (__DEV__) console.warn('[crash] capture', e, context)
  }
}
