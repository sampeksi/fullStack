import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/notification'
import AddBlog from './components/addBlog'
import LoginForm from './components/loginForm'
import Togglable from './components/togglable'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs(blogs.sort((a, b) => b.likes - a.likes))
      )
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = (user) => {
    setUser(user)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLikeUpdate = (blogId) => {
    const updatedBlogs = blogs.map(blog =>
      blog.id === blogId ? { ...blog, likes: blog.likes + 1 } : blog
    )
    const sortedBlogs = updatedBlogs.sort((a, b) => b.likes - a.likes)
    setBlogs(sortedBlogs)
  }

  const blogDeletion = async (blogToDelete) => {
    try {
      await blogService.deleteBlog(blogToDelete)
      setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
      setNotification({
        message: `Blog '${blogToDelete.title}' by '${blogToDelete.author}' deleted successfully`,
        type: 'success'
      })
    } catch (exception) {
      setNotification({
        message: `Deletion failed: '${exception}'`,
        type: 'error'
      })
    }
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <AddBlog setBlogs={setBlogs} blogs={blogs} setNotification={setNotification} blogFormRef={blogFormRef} />
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <LoginForm handleLogin={handleLogin}/>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification?.message} type={notification?.type}/>
      <div>
        {user.username} logged in
        <button onClick={handleLogout}>Logout</button>
      </div>
      <br/>

      <h2>create new</h2>
      <div>
        {blogForm()}
      </div>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleLikeUpdate={handleLikeUpdate} blogDeletion={blogDeletion}/>
      )}
    </div>
  )
}

export default App
