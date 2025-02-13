// App que nos dirá puerto disponible

const net = require('node:net')

function findAvailablePort (desiredPort) {
    return new Promise((resolve, reject) => {
        const server = net.createServer()

        server.listen(desiredPort, () => {
            const { port } = server.address()
            server.close(() => {
                resolve(port)
            })
        })

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                findAvailablePort(desiredPort + 1).then(port => resolve(port))
                // también se podría utilizar findAvailablePort(0) para buscar el primer puerto disponible
            } else {
                reject(err)
            }
        })
    })
}

module.exports = { findAvailablePort }