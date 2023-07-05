import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q='
const api_key = '&appid=' + process.env.REACT_APP_API_KEY
const iconUrl = 'https://openweathermap.org/img/wn/'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getWeather = capital => {
    let url = weatherUrl + capital + api_key
    const request = axios.get(url)
    return request.then(response => response.data)
}

const getIcon = iconCode => {
    let icon = iconUrl + iconCode + '@2x.png'
    return icon
}

export default {getAll, getWeather, getIcon}