import express from 'express'
import logger from 'morgan'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 1000
  }
})

io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado')

  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado')
  })

  socket.on('Chat message', (msg) => {
    io.emit('Chat message', msg) // Emite el mensaje a todos los usuarios
  })
})

app.use(logger('dev'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
