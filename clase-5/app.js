import express, { json } from 'express' // require -> CommonJS
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

// Cómo leer un .json en ESModules
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

// Cómo leer un .json en ESModules recomendado por ahora

const app = express()
app.use(corsMiddleware())
app.use(json()) // Middleware para parsear body de las requests
app.disable('x-powered-by')

// Todos los recursos que sean MOVIES se identifican con /movies
app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
