const http = require('node:http') // Protocolo HTTP

const desiredPort = process.env.PORT ?? 1234

const processRequest = (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')

    if (req.url == '/') {
        res.statusCode = 200 // OK
        res.end('Bienvenido a la página de inicio')
    } else if (req.url == '/contacto') {
        res.statusCode = 200 // OK
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

