import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Toggleable from './components/Togglable'
import BlogForm from './components/BlogForm'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({ message: null, type: '' });
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
    })
  }

  const updatelikedBlog = (id) => {
    const blogToLike = blogs.find(blog => blog.id == id)

    const likedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1
    }
    blogService.update(id, likedBlog).then(returnedBlog => {
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog));
    })
  }

  const removeBlog = (id) => {
    const blogToRemove = blogs.find(blog => blog.id === id);

    if (window.confirm(`Are you sure you want to remove the blog "${blogToRemove.title}"?`)) {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id)); // Elimina el blog del estado
          setNotification({ message: `The blog "${blogToRemove.title}" was successfully removed.`, type: 'success' });
        })
        .catch(error => {
          setNotification({ message: `Failed to remove the blog. It may have already been removed.`, type: 'error' });
        });

      setTimeout(() => {
        setNotification({ message: null, type: '' });
      }, 3000);
    }
  }

  const blogForm = () => (
    <Toggleable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Toggleable>
  )

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    location.reload()
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({ message: 'Login Success', type: 'success' })

    } catch (exception) {
      setNotification({ message: 'wrong credentials', type: null })
    }
    setTimeout(() => {
      setNotification({ message: null, type: '' })
    }, 3000)
  };

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>Log In</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <div>
        <Notification message={notification.message} type={notification.type} />


        {!user && loginForm()}
        {user &&
          (<div>
            <button onClick={() => handleLogout()}>Logged Out</button>
            {blogForm()}
          </div>)}

        {blogs.sort((a, b) => (b.likes - a.likes)).map(blog =>
          <div key={blog.id}>
            <Blog blog={blog} handleLike={() => updatelikedBlog(blog.id)} handleRemoveBlog={() => removeBlog(blog.id)} />
          </div>
        )}


      </div>
    </div>
  )
}

export default App