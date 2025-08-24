import assert from 'node:assert'

async function ping(url: string) {
  const r = await fetch(url)
  assert.ok(r.ok, `GET ${url} failed: ${r.status}`)
}

async function main() {
  await ping('http://127.0.0.1:4001/health')
  await ping('http://127.0.0.1:4002/health')
  console.log('HEALTH PASS')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
