const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Title example',
        autho: 'Author example',
        url: 'URL example',
        likes: 100
    },
    {
        title: 'Title example 2',
        autho: 'Author example 2',
        url: 'URL example 2',
        likes: 50
    }
]

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'Non exist title',
        url: 'URL example 2',
        author: 'Author Name',
        likes: 100,
    })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
}