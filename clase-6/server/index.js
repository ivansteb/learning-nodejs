import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

dotenv.config()
const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 1000
  }
})

const db = createClient({
  url: 'libsql://guided-hawk-ivansteb.turso.io',
  authToken: process.env.DB_TOKEN
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    user TEXT
  )
`)

io.on('connection', async (socket) => {
  console.log('Un usuario se ha conectado')

  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado')
  })

  socket.on('Chat message', async (msg) => {
    let result
    const username = socket.handshake.auth.username ?? 'anonymous'

    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (content, user) VALUES (:msg, :username)',
        args: { msg, username }
      })
    } catch (e) {
      console.error(e)
      return
    }

    io.emit('Chat message', msg, result.lastInsertRowid.toString(), username) // Emite el mensaje a todos los usuarios
  })

  if (!socket.recovered) {
    try {
      const results = await db.execute({
        sql: 'SELECT id, content, user FROM messages WHERE id > ?',
        args: [socket.handshake.auth.serverOffset ?? 0]
      })

      results.rows.forEach(row => {
        socket.emit('Chat message', row.content, row.id.toString(), row.user)
      })
    } catch (e) {
      console.error(e)
    }
  }
})

app.use(logger('dev'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
