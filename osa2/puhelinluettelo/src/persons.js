import axios from 'axios'
const baseUrl = 'api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}
  
const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}
  
const deleteThisPerson = id => {
    return axios.delete(baseUrl + '/' + id).then(response => response.data);
  }

export default { getAll, create, deleteThisPerson }
