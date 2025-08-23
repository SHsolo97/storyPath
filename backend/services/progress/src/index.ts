import Fastify from 'fastify'
import { PrismaClient, type Prisma } from '@prisma/client'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Load env from backend/.env to ensure DATABASE_URL is available at runtime
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
// src -> progress -> services -> backend
const backendRoot = path.resolve(scriptDir, '..', '..', '..')
dotenv.config({ path: path.resolve(backendRoot, '.env'), override: true })

const server = Fastify({ logger: true })
const prisma = new PrismaClient()

server.get('/health', async () => ({ ok: true }))

server.get('/progress/:userId/:storyId', async (req, reply) => {
  const { userId, storyId } = req.params as { userId: string; storyId: string }
  const save = await prisma.save.findFirst({ where: { userId, storyId } })
  if (!save) return reply.code(404).send({ error: 'Not found' })
  return save
})

server.post('/progress', async (req, reply) => {
  try {
    const body = req.body as Partial<{
      userId: string
      storyId: string
      chapterId: string
      nodeId: string
      variables: Prisma.JsonValue
    }>
    // Basic input validation
    const required = ['userId', 'storyId', 'chapterId', 'nodeId'] as const
    for (const k of required) {
      if (!body[k]) return reply.code(400).send({ error: `Missing ${k}` })
    }
    const variables: Prisma.JsonValue = body.variables ?? {}

    // Ensure the user exists (dev-friendly behavior)
    await prisma.user.upsert({
      where: { id: body.userId! },
      update: {},
      create: { id: body.userId! }
    })

    // Upsert by (userId, storyId)
    const existing = await prisma.save.findFirst({
      where: { userId: body.userId, storyId: body.storyId }
    })
    if (existing) {
      const updated = await prisma.save.update({
        where: { id: existing.id },
        data: {
          chapterId: body.chapterId!,
          nodeId: body.nodeId!,
          variables
        }
      })
      return { status: 'updated', id: updated.id }
    }
    const created = await prisma.save.create({
      data: {
        userId: body.userId!,
        storyId: body.storyId!,
        chapterId: body.chapterId!,
        nodeId: body.nodeId!,
        variables
      }
    })
    return { status: 'created', id: created.id }
  } catch (err: any) {
    server.log.error({ err }, 'progress POST failed')
    return reply
      .code(500)
      .send({ error: 'internal_error', detail: String(err?.message ?? err) })
  }
})

const port = Number(process.env.PORT || 4002)
server
  .listen({ port, host: '0.0.0.0' })
  .then(() => server.log.info({ port }, 'progress service started'))
  .catch((err: unknown) => {
    server.log.error({ err }, 'failed to start')
    // Do not hard-exit; allow crash handlers to log full details
    process.exitCode = 1
  })

// Crash diagnostics
process.on('unhandledRejection', (reason) => {
  server.log.error({ err: reason }, 'unhandledRejection')
})
process.on('uncaughtException', (err) => {
  server.log.error({ err }, 'uncaughtException')
})
