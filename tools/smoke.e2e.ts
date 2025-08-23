import assert from 'node:assert'

const content = process.env.CONTENT_URL ?? 'http://localhost:4001'
const progress = process.env.PROGRESS_URL ?? 'http://localhost:4002'

async function main() {
  const h1 = await fetch(`${content}/health`).then((r) => r.ok)
  assert.ok(h1, 'content /health failed')

  const stories = await fetch(`${content}/stories`).then((r) => r.json())
  assert.ok(Array.isArray(stories) && stories.length > 0, 'no stories returned')
  const storyId = stories[0].id

  const h2 = await fetch(`${progress}/health`).then((r) => r.ok)
  assert.ok(h2, 'progress /health failed')

  const userId = process.env.DEV_USER_ID ?? 'user_dev_1'
  // Try saving progress
  const payload = {
    userId,
    storyId,
    chapterId: 'ch-1',
    nodeId: 'n-1',
    variables: { seen: true }
  }
  const saved = await fetch(`${progress}/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!saved.ok) {
    const text = await saved.text().catch(() => '')
    throw new Error(
      `progress POST failed: ${saved.status} ${saved.statusText} ${text}`
    )
  }

  const got = await fetch(`${progress}/progress/${userId}/${storyId}`)
  assert.ok(got.ok, 'progress GET failed')
  const body = await got.json()
  assert.equal(body.storyId, storyId)
  console.log('SMOKE PASS')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
