import { useState, useEffect, useRef } from 'react'
import LoginForm from '../components/LoginForm'
import Toggleable from '../components/Togglable'
import BlogForm from '../components/BlogForm'
import { useDispatch, useSelector } from 'react-redux'
import Notification from '../features/notification/notification'
import { getAllBlog } from '../features/blog/blogReducer'
import Blogs from '../features/blog/blogs'
import { handleLogin, handleLogout, handleLogged } from '../features/login/loginReducer'

const BlogPage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllBlog())
  })

  return (
    <div>
      <h2>blogs</h2>
      <div>
        <Notification />
        <Blogs />
      </div>
    </div>
  )
}

export default BlogPage