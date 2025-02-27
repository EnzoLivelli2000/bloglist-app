const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')
const { request, response } = require('../app')

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // Validar que el username y la password existen y tienen al menos 3 caracteres
  if (!username || username.length < 3) {
    return response.status(400).json({
      error: 'username must be at least 3 characters long'
    })
  }

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long'
    })
  }

  // Verificar si el username ya existe en la base de datos
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
  response.json(users)
})

userRouter.get('/:id', async (request, response) => {
  try {
    const user = await User.findById(request.params.id).populate('blogs', { url: 1, title: 1, author: 1, id: 1 })

    if (!user) {
      return response.status(404).json({
        error: 'User not found'
      })
    }

    response.json(user)
  } catch (error) {
    response.status(400).json({
      error: 'Invalid ID format'
    })
  }
})

module.exports = userRouter