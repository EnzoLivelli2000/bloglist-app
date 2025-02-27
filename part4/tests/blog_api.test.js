const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../tests/test_helper')
const assert = require('node:assert')

const api = supertest(app)
let token;

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const newUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'testpassword'
    }

    await api
        .post('/api/users')
        .send(newUser)

    const loginResponse = await api
        .post('/api/login')
        .send({
            username: newUser.username,
            password: newUser.password
        })

    token = loginResponse.body.token

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are retuned as JSON', async () => {
    await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`) // Usar el token en la solicitud
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('unique identifier property of blog posts is named id', async () => {
    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`) // Usar el token en la solicitud
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogs = response.body
    blogs.forEach(blog => {
        // Verifica que 'id' esté definido
        assert(blog.id !== undefined)
        // Verifica que '_id' no esté definido
        assert.strictEqual(blog._id, undefined)
    })
})

test('an existing blog can be updated', async () => {
    // Obtenemos todos los blogs actuales
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0] // Seleccionamos el primer blog

    // Creamos un nuevo objeto blog con datos actualizados
    const updatedBlogData = {
        title: 'Updated Title',
        author: 'Updated Author',
        url: 'http://updatedurl.com',
        likes: blogToUpdate.likes + 10
    }

    // Realizamos la solicitud PUT para actualizar el blog
    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlogData)
        .expect(200) // Verificamos que la respuesta sea 200 OK
        .expect('Content-Type', /application\/json/)

    // Verificamos que el blog haya sido actualizado correctamente
    const updatedBlog = response.body
    assert.strictEqual(updatedBlog.title, updatedBlogData.title)
    assert.strictEqual(updatedBlog.author, updatedBlogData.author)
    assert.strictEqual(updatedBlog.url, updatedBlogData.url)
    assert.strictEqual(updatedBlog.likes, updatedBlogData.likes)

    // Verificamos que el blog actualizado esté en la base de datos
    const blogsAtEnd = await helper.blogsInDb()
    const blogLikes = blogsAtEnd.map(b => b.likes)
    assert(blogLikes.includes(updatedBlogData.likes))
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'new title',
        author: 'new author',
        url: 'new url',
        likes: 10
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`) // Usar el token en la solicitud
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const response = await helper.blogsInDb()
    assert.strictEqual(response.length, helper.initialBlogs.length + 1)

    const contents = response.map(n => n.title)
    assert(contents.includes('new title'))
})

test('a valid blog without likes can be added', async () => {
    const newBlog = {
        title: 'new title',
        author: 'new author',
        url: 'new url',
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`) // Usar el token en la solicitud
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDb()
    assert.strictEqual(response.length, helper.initialBlogs.length + 1)

    const likes = response.map(n => n.likes)
    assert(likes.includes(0))
})

test('a blog without title and url is not added', async () => {
    const newBlog = {
        author: 'new author',
        likes: 10
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`) // Usar el token en la solicitud
        .send(newBlog)
        .expect(400)

    const response = await helper.blogsInDb()
    assert.strictEqual(response.length, helper.initialBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
})