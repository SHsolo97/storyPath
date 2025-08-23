import Fastify from 'fastify'
import cors from '@fastify/cors'

const server = Fastify({ logger: true })
await server.register(cors, { origin: true })

server.get('/health', async () => ({ ok: true }))

// TODO: Add auth verification middleware (Firebase) in S2

const port = Number(process.env.PORT || 3000)
server.listen({ port, host: '0.0.0.0' }).catch((err: unknown) => {
  server.log.error(err)
  process.exit(1)
})
