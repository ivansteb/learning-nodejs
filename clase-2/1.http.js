const http = require('node:http') // Protocolo HTTP
const fs = require('node:fs')

const desiredPort = process.env.PORT ?? 1234

const processRequest = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  if (req.url === '/') {
    res.end('Bienvenido a la página de inicio')
  } else if (req.url === '/imagen-espectacular.jpg') {
    fs.readFile('./bocajrs.jpg', (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end('<h1>500 - Internal Server Error</h1>')
      } else {
        res.setHeader('Content-Type', 'image/jpg')
        res.end(data)
      }
    })
  } else if (req.url === '/contacto') {
    res.end('Contacto')
  } else {
    res.statusCode = 404 // Not Found
    res.end('404 - Página no encontrada')
  }
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
  console.log(`Server listening on port http://localhost:${desiredPort}`)
})
