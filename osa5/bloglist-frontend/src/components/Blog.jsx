import React, { useState } from 'react'
import '../styles/blog.css'
import blogService from '../services/blogs.jsx'

const Expandable = ({ buttonLabel, blog, children }) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpansion = () => {
    setExpanded(!expanded)
  }

  return (
    <div>
      {blog.title} {blog.author} { }
      <button onClick={toggleExpansion}>
        {expanded ? 'hide' : buttonLabel}
      </button>
      {expanded && children}
    </div>
  )
}

const Blog = ({ blog, user, handleLikeUpdate, blogDeletion }) => {
  const [currentBlog, setBlog] = useState(blog)

  const handleAddLike = async () => {
    try {
      const updatedBlog = { ...currentBlog, likes: currentBlog.likes + 1 }
      await blogService.addLikes(updatedBlog)
      setBlog(updatedBlog)
      handleLikeUpdate(updatedBlog.id)
    } catch (error) {
      console.error('Error adding like:', error)
    }
  }

  const handleDeleteBlog = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this blog?')
    if (confirmed) {
      blogDeletion(currentBlog)
    }
  }

  return (
    <div className='blog-post'>
      <Expandable buttonLabel='view' blog={currentBlog}>
        <br/>
        {currentBlog.url}
        <br/>
        likes: {currentBlog.likes} { }
        <button onClick={handleAddLike}>like</button>
        <br/>
        {currentBlog.user.name}
        {currentBlog.user.username === user.username ?
          <><br/><button onClick={handleDeleteBlog}>delete</button></> : null}
      </Expandable>
    </div>
  )
}

export default Blog
