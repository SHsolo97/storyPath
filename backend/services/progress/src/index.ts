import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Load env from backend/.env to ensure DATABASE_URL is available at runtime
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
// src -> progress -> services -> backend
const backendRoot = path.resolve(scriptDir, '..', '..', '..')
dotenv.config({ path: path.resolve(backendRoot, '.env') })

const server = Fastify({ logger: true })
const prisma = new PrismaClient()

server.get('/health', async () => ({ ok: true }))

server.get('/progress/:userId/:storyId', async (req, reply) => {
  const { userId, storyId } = req.params as { userId: string; storyId: string }
  const save = await prisma.save.findFirst({ where: { userId, storyId } })
  if (!save) return reply.code(404).send({ error: 'Not found' })
  return save
})

server.post('/progress', async (req) => {
  const body = req.body as {
    userId: string
    storyId: string
    chapterId: string
    nodeId: string
    variables: Record<string, unknown>
  }
  // Upsert by finding existing (userId, storyId)
  const existing = await prisma.save.findFirst({
    where: { userId: body.userId, storyId: body.storyId }
  })
  if (existing) {
    const updated = await prisma.save.update({
      where: { id: existing.id },
      data: {
        chapterId: body.chapterId,
        nodeId: body.nodeId,
        variables: body.variables
      }
    })
    return { status: 'updated', id: updated.id }
  }
  const created = await prisma.save.create({
    data: {
      userId: body.userId,
      storyId: body.storyId,
      chapterId: body.chapterId,
      nodeId: body.nodeId,
      variables: body.variables
    }
  })
  return { status: 'created', id: created.id }
})

const port = Number(process.env.PORT || 4002)
server.listen({ port, host: '0.0.0.0' }).catch((err: unknown) => {
  server.log.error(err)
  process.exit(1)
})
