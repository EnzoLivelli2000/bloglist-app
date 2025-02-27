const { test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('../tests/test_helper')
const assert = require('node:assert')

const api = supertest(app)
let token

beforeEach(async () => {
    await User.deleteMany({})

    const user = {
        username: 'root',
        name: 'Superuser',
        password: 'rootpassword',
    }

    // Crear un usuario inicial
    await api.post('/api/users').send(user)

    // Autenticarse para obtener el token
    const response = await api
        .post('/api/login')
        .send({ username: 'root', password: 'rootpassword' })

    token = response.body.token
    assert(token)  // Verificamos que el token se haya generado correctamente
})

test('succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
    }

    await api
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`) // Usar el token en la solicitud
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
})

test('fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'ro',
        name: 'Short username',
        password: 'salainen',
    }

    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('username must be at least 3 characters long'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'validuser',
        name: 'Valid User',
        password: 'pw', // contraseña muy corta
    }

    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('password must be at least 3 characters long'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('fails with proper statuscode and message if username is not unique', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'rootpassword',
    }

    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('username must be unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

after(async () => {
    await mongoose.connection.close()
})
