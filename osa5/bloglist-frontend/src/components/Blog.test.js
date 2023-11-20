import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import AddBlog from './addBlog'
import * as blogService from '../services/blogs'

jest.mock('../services/blogs', () => ({
    addLikes: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
}))
  
const blog = {
    title: 'test for title',
    author: 'test account',
    url: 'http::test.fi',
    likes: 0,
    user: {
        username: 'loginTest',
        name: 'logi',
        password: 'loginTest'
    }
}

const u = {
    username: 'loginTest',
    name: 'logi',
    password: 'loginTest'
}

test('renders title', () => {

  render(<Blog blog={blog} user={u} />)

  const element = screen.getByText(/test for title/i)
  expect(element).toBeDefined()
})

test('expanding shows url, amount of likes and user', async () => {
  
    render(
      <Blog blog={blog} user={u}/>
    )
  
    const user = userEvent.setup()
    const button = screen.getByText(/view/i)
    await user.click(button)
  
    const url = screen.getByText(/http::test.fi/i)
    const likes = screen.getByText(/likes: 0/i)
    const blogUser = screen.getByText(/logi/i)

    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(blogUser).toBeDefined()
  })

test('eventHandler calls match like button clicks', async () => {

    const mockHandler = jest.fn()
    const user = userEvent.setup()
    render(<Blog blog={blog} user={u} handleLikeUpdate={mockHandler} />)

    const view = screen.getByText(/view/i)
    await user.click(view)
    
    const like = screen.getByText('like')
    await user.click(like)
    await user.click(like)

    expect(blogService.addLikes).toHaveBeenCalledTimes(2)
})

test('addBlog calls callback with correct params', async () => {
    const user = userEvent.setup()
    const addBlog = jest.fn()
    const setNotification = jest.fn()
    const blogFormRef = {
      current: {
        toggleVisibility: jest.fn(),
      },
    }
    
    render(<AddBlog addBlog={addBlog} blogs={[blog]} 
      setNotification={setNotification} blogFormRef={blogFormRef}/>)

    const inputs = screen.getAllByRole('textbox')
    const sendButton = screen.getByText('create')

    await user.type(inputs[0], 'testing a form title')
    await user.type(inputs[1], 'test author')
    await user.type(inputs[2], 'http::test.fi')
    await user.click(sendButton)

    expect(blogService.create).toHaveBeenCalledTimes(1);
    expect(blogService.create).toHaveBeenCalledWith(expect.objectContaining({
      title: 'testing a form title',
      author: 'test author',
      url: 'http::test.fi',
    }))
})