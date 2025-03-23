export const {
    PORT = 3000,
    SALT_ROUNDS = 10, // Producción: 10, Desarrollo: 1
    SECRET_JWT_KEY = 'this-is-an-awesome-secret-key-ultra-important-keep-it-secret'
} = process.env