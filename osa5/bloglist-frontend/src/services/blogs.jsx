import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.get(baseUrl, config)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const addLikes = async likedBlog => {
  const config = {
    headers: { Authorization: token },
  }
  const url = baseUrl + '/' + likedBlog.id
  const response = await axios.put(url, likedBlog, config)
  return response.data
}

const deleteBlog = async selectedBlog => {
  const config = {
    headers: { Authorization: token },
  }
  const url = baseUrl + '/' + selectedBlog.id
  const response = await axios.delete(url, config)
  return response.data
}

export default { setToken, getAll, create, addLikes, deleteBlog }
