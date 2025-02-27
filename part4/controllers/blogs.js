const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {

    /* const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    } */

    const blogs = await Blog.find({}).populate('user', { name: 1, username: 1, id: 1 })
    response.json(blogs)
})

blogsRouter.delete('/:id', async (request, response) => {
    const { id } = request.params
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'Token missing or invalid' })
    }

    const blog = await Blog.findById(id)

    if (!blog) {
        return response.status(404).json({ error: 'Blog not found' })
    }

    // Compara el ID del creador del blog con el ID del usuario autenticado
    if (blog.user.toString() !== decodedToken.id.toString()) {
        return response.status(403).json({ error: 'Permission denied, unauthorized user' })
    }

    await Blog.findByIdAndDelete(id)

    const user = await User.findById(decodedToken.id)
    user.blogs = user.blogs.filter(blogId => blogId.toString() !== id.toString())

    // Guarda los cambios en la base de datos
    await user.save()

    response.status(204).end()
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!body.title || !body.url) {
        return response.status(400).json({
            error: "title or url is missing"
        })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    if (!body.likes) {
        return response.status(400).json({
            error: "likes is missing"
        })
    }

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(updatedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
    try {
        const blog = await Blog.findById(request.params.id)

        if (!blog) {
            return response.status(404).json({
                error: 'blog not found'
            })
        }

        response.json(blog)
    } catch (error) {
        response.status(400).json({
            error: 'Invalid ID format'
        })
    }
})

blogsRouter.post('/:id/comments', async (request, response) => {
    const { id } = request.params;
    const { comment } = request.body;

    if (!comment || comment.trim() === '') {
        return response.status(400).json({ error: 'Comment cannot be empty' });
    }

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return response.status(404).json({ error: 'Blog not found' });
        }

        blog.comments = blog.comments.concat(comment);
        const updatedBlog = await blog.save();

        response.status(201).json(updatedBlog);
    } catch (error) {
        response.status(400).json({ error: 'Invalid ID format' });
    }
})
module.exports = blogsRouter