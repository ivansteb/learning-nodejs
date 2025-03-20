import express, { json } from 'express' // require -> CommonJS
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

export const createApp = ({ movieModel }) => {
  const app = express()
  app.use(corsMiddleware())
  app.use(json())
  app.disable('x-powered-by')

  // Todos los recursos que sean MOVIES se identifican con /movies
  app.use('/movies', createMovieRouter({ movieModel }))

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
  })
}
