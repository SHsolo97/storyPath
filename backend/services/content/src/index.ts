import Fastify from 'fastify'
import dotenv from 'dotenv'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const server = Fastify({ logger: true })

// Load env from backend/.env to keep local dev consistent
try {
  // __dirname equivalent for ESM
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const backendRoot = path.resolve(scriptDir, '..', '..', '..')
  dotenv.config({ path: path.resolve(backendRoot, '.env'), override: true })
} catch {}

function getRepoRoot() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(scriptDir, '..', '..', '..', '..')
}

let storyPack: any | null = null

server.get('/health', async () => ({ ok: true }))

server.get('/stories', async () => {
  await ensureStory()
  const s = storyPack!.story
  return [
    {
      id: s.id,
      title: s.title,
      description: s.description,
      cover: s.cover,
      genres: s.genres,
      premiumModel: s.premiumModel
    }
  ]
})

server.get('/stories/:id', async (req, reply) => {
  await ensureStory()
  const s = storyPack!.story
  return s.id === (req.params as any).id
    ? s
    : reply.code(404).send({ error: 'Not found' })
})

server.get('/stories/:id/chapters', async (req, reply) => {
  await ensureStory()
  const s = storyPack!.story
  if (s.id !== (req.params as any).id)
    return reply.code(404).send({ error: 'Not found' })
  return s.chapters.map((c: any) => ({
    id: c.id,
    index: c.index,
    title: c.title,
    premium: c.premium
  }))
})

async function ensureStory() {
  if (storyPack) return
  const repoRoot = getRepoRoot()
  const samplePath = path.resolve(repoRoot, 'schemas', 'sample-story.json')
  const raw = await readFile(samplePath, 'utf8')
  storyPack = JSON.parse(raw)
}

const port = Number(process.env.PORT || 4001)
server.listen({ port, host: '0.0.0.0' }).catch((err: unknown) => {
  server.log.error(err)
  process.exit(1)
})
