import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      // get genre ids from database table using genre names
      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?;', [lowerCaseGenre]
      )

      // no genre found
      if (genres.length === 0) return []

      // get the id from the first genre result
      const [{ id }] = genres

      // get all movies ids from database table
      const [movies] = await connection.query(
        'SELECT movie_id FROM movie_genres WHERE genre_id = ?;', [id]
      )

      // do the join and show return the movies
      return movies
    }

    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;'
    )

    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query(
        `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id 
        FROM movie WHERE id = UUID_TO_BIN(?);`,
        [id]
    )

    if (movies.length === 0) return null

    return movies[0]
  }

  static async create ({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
            `INSERT INTO movie (id, title, year, director, duration, poster, rate) 
            VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
            [title, year, director, duration, poster, rate]
      )

      if (genreInput) {
        const lowerCaseGenre = genreInput.toLowerCase()

        // reviso si el genre ya existe
        const [genres] = await connection.query(
          'SELECT id FROM genre WHERE LOWER(name) = ?;',
          [lowerCaseGenre]
        )

        let genreId
        if (genres.length === 0) {
          // si no existe, lo creo
          const [genreResult] = await connection.query(
            'INSERT INTO genre (name) VALUES (?);',
            [lowerCaseGenre]
          )
          genreId = genreResult.insertId
        } else {
          genreId = genres[0].id
        }

        // asociar el genre con la película
        await connection.query(
            `INSERT INTO movie_genres (movie_id, genre_id)
            VALUES (UUID_TO_BIN("${uuid}"), ?);`,
            [uuid, genreId]
        )
      }
    } catch (e) {
      // evitar enviar información sensible al cliente
      throw new Error('Error creating movie')
      // enviar la traza a un servicio interno
    }

    const [movies] = await connection.query(
        `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id 
        FROM movie WHERE id = UUID_TO_BIN(?);`,
        [uuid]
    )

    return movies[0]
  }

  static async delete ({ id }) {
    await connection.query(
      'DELETE FROM movie WHERE id = UUID_TO_BIN(?);',
      [id]
    )
  }

  static async update ({ id, input }) {
    const {
      genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    try {
      await connection.query(
                    `UPDATE movie
                    SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ?
                    WHERE id = UUID_TO_BIN(?);`,
                    [title, year, director, duration, poster, rate, id]
      )

      if (genreInput && Array.isArray(genreInput)) {
        // eliminar asociaciones previas
        await connection.query(
          'DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?);',
          [id]
        )

        for (const genre of genreInput) {
          const lowerCaseGenre = genre.toLowerCase()

          // reviso si el genre ya existe
          const [genres] = await connection.query(
            'SELECT id FROM genre WHERE LOWER(name) = ?;',
            [lowerCaseGenre]
          )

          let genreId
          if (genres.length === 0) {
            // si no existe, lo creo
            const [genreResult] = await connection.query(
              'INSERT INTO genre (name) VALUES (?);',
              [lowerCaseGenre]
            )
            genreId = genreResult.insertId
          } else {
            genreId = genres[0].id
          }

          // asociar el genre con la película
          await connection.query(
                    `INSERT INTO movie_genres (movie_id, genre_id)
                    VALUES (UUID_TO_BIN(?), ?);`,
                    [id, genreId]
          )
        }
      }
    } catch (e) {
      console.error('Error updating movie', e)
      throw new Error('Error updating movie')
      // enviar la traza a un servicio interno
    }

    const [movies] = await connection.query(
            `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id 
            FROM movie WHERE id = UUID_TO_BIN(?);`,
            [id]
    )

    return movies[0]
  }
}
