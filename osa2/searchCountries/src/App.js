import { useState, useEffect } from 'react'
import countryService from './countries'

const Display = ({ countryList, handleButtonClick, selectedCountry, 
  weather, icon }) => {
  if (countryList.length > 10) {
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  } else if (countryList.length === 1 || selectedCountry) {
    const country = selectedCountry || countryList[0]

    if (weather === null) {
      return <div>Loading weather data...</div>
    }

    if (weather.cod !== 200) {
      return <div>Error fetching weather data: {weather.message}</div>
    }

    const temperature = Math.round((parseFloat(weather.main.temp) - 273.15) * 10) / 10

    return (
      <div>
        <h1>{country.name.common}</h1>
        <div>capital {country.capital}</div>
        <div>area {country.area}</div>
        <h2>languages:</h2>
        <ul>
          {Object.entries(country.languages).map(([key, value]) => (
            <li key={key}>{value}</li>
          ))}
        </ul>
        <div>
          <img src={country.flags.png}/>
        </div>
        <div>
          <h1>Weather in {country.capital}</h1>
        </div>
        <div>temperature {temperature} Celsius</div>
        <div>
          <img src={icon}/>
        </div>
        <div>wind {weather.wind.speed} m/s</div>
      </div>
    );
  } else {
    return (
      <div>
        {countryList.map((country) => (
          <div key={country.name.common}>
            {country.name.common}{' '}
            <button onClick={() => handleButtonClick(country)}>select</button>
          </div>
        ))}
      </div>
    );
  }
};

const Filter = ({ handleFilterChange }) => {
  return (
    <div>
      find countries
      <input onChange={handleFilterChange} />
    </div>
  );
};

function App() {
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [filter, setFilter] = useState('')
  const [weather, setWeather] = useState(null)
  const [icon, setIcon] = useState(null)

  useEffect(() => {
    countryService.getAll().then((countryData) => {
      console.log('promise fulfilled')
      setCountries(countryData)
    })
  }, [])

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  const handleFilterChange = (event) => {
    setSelectedCountry(null);
    setFilter(event.target.value);
  }

  const handleButtonClick = (country) => {
    setSelectedCountry(country);
  }

  useEffect(() => {
    if (selectedCountry || (filteredCountries.length === 1 && weather === null)) {
      countryService
        .getWeather(selectedCountry?.capital || filteredCountries[0]?.capital)
        .then((weatherData) => {
          setWeather(weatherData)
          setIcon(countryService.getIcon(weatherData.weather[0].icon))
        })
        .catch((error) => {
          console.log('Error fetching weather data:', error)
        });
    }
  }, [selectedCountry, filteredCountries, weather])

  return (
    <div>
      <Filter handleFilterChange={handleFilterChange} />
      <div>
        <Display
          countryList={filteredCountries}
          handleButtonClick={handleButtonClick}
          selectedCountry={selectedCountry}
          weather={weather}
          icon={icon}
        />
      </div>
    </div>
  )
}

export default App;
