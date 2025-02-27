const { default: mongoose } = require("mongoose");
const logger = require('./utils/logger')
const config = require('./utils/config')
const express = require('express')
const app = express()
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((e) => {
        logger.error('error connecting to MongoDB', e.message)
    })

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.userExtractor)

app.use('/api/blogs', middleware.tokenExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandle)

module.exports = app

