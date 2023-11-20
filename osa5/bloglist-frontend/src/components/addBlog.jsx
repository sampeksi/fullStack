import React, { useState } from 'react'
import blogService from '../services/blogs'

const AddBlog = ({ setBlogs, blogs, setNotification, blogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handlePost = async (event) => {
    event.preventDefault()

    try {
      const blog = {
        title: title,
        author: author,
        url: url
      }
      const newPost = await blogService.create(blog)
      setBlogs(blogs.concat(newPost))
      blogFormRef.current.toggleVisibility()

      setNotification({
        message: `a new blog '${title}' by '${author}' added`,
        type: 'success'
      })

      setTimeout(() => {
        setNotification(null)
      }, 3000)

      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      setNotification({
        message: `post failed: '${exception}'`,
        type: 'error'
      })

      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  return (
    <form onSubmit={handlePost}>
      <div>
        title:
        <input
          id='blog-title'
          type='text'
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div>
        author:
        <input
          id='blog-author'
          type='text'
          value={author}
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        url:
        <input
          id='blog-url'
          type='text'
          value={url}
          onChange={handleUrlChange}
        />
      </div>
      <button id='create-blog-post' type='submit'>create</button>
    </form>
  )
}

export default AddBlog
