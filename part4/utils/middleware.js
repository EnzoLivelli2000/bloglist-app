const logger = require("./logger")
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method: ', request.method)
    logger.info('Path: ', request.path)
    logger.info('Body: ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandle = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === ' validationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique' })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'token invalid' })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }
    next(error)
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('Authorization')

    if (authorization && authorization.startsWith('Bearer ')) {
        req.token = authorization.replace('Bearer ', '') // Extrae el token sin 'Bearer '
    } else {
        req.token = null
    }

    next() // Llama a la siguiente función middleware
}

const userExtractor = (req, res, next) => {
    if (req.token) {
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if (decodedToken.id) {
            req.user = decodedToken
        }
    }
    next()
}
module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandle,
    tokenExtractor,
    userExtractor
}