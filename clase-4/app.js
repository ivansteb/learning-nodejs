import express, { json } from 'express' // require -> CommonJS
import { randomUUID } from 'node:crypto'
import cors from 'cors' // Precaución: permite cualquier origen

import { validateMovie, validatePartialMovie } from './schemas/movies.js'

// Cómo leer un .json en ESModules
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

// Cómo leer un .json en ESModules recomendado por ahora
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const movies = require('./movies.json')

const app = express()
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = ['http://localhost:8080', 'http://localhost:1234', 'https://myapp.com']

    if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))
app.use(json()) // Middleware para parsear body de las requests
app.disable('x-powered-by')

// Todos los recursos que sean MOVIES se identifican con /movies
app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }

  res.json(movies)
})

app.get('/movies/:id', (req, res) => { // path-to-regexp
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ error: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    // podría ser 422 Unprocessable Entity
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  // en base de datos
  const newMovie = {
    id: randomUUID(), // uuid v4
    ...result.data
  }

  // Actualmente no sería REST porque estamos guardando el estado en memoria
  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)
  return res.json({ message: 'Movie deleted' })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = findIndex(movie => movie.id === id)

  if (!movieIndex < 0) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updatedMovie
  return res.json(updatedMovie)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
