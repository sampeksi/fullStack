import { useState, useEffect } from 'react'
import personService from './persons'
import './index.css'

const Display = ({id, name, number, handleDeletion, handeleSubmit}) => {
  return (
    <div>
      <form onSubmit={handeleSubmit}>
        <div>
          <p>
            {name} {number} {"  "}
            <button type='submit'
            onClick={() => handleDeletion(id)}>delete</button>
          </p>
        </div>
      </form>
    </div>
  )
}

const Filter = (params) => {
  return (
    <div>
      Filter by name:
      <input onChange={params.handleFilterChange} />
    </div>
  )
}

const PersonForm = (params) => {
  return (
    <div>
      <form onSubmit={params.handleSubmit}>
        <div>
          name: 
          <input 
          value={params.newName}
          onChange={params.handleNewName}
          />
        </div>
        <div>
          number:
          <input
          value={params.newNumber}
          onChange={params.handleNewNumber}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const getClassname = () => {
    switch (type) {
      case 'success':
        return 'success'
      case 'error':
        return 'error'
      default:
        return ''
    }
  }

  const className = `notification ${getClassname()}`

  return <div className={className}>{message}</div>
};

const App = () => {

  useEffect(() => {
    personService
      .getAll()
        .then(personsData => {
          console.log('promise fulfilled')
          setPersons(personsData)
        })
  }, [])

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [personId, deleteId] = useState('')
  const [newMessage, setMessage] = useState(null)

  const addPerson = (event) => {
    event.preventDefault()
    const person = {
      name: newName,
      number: newNumber,
      id: Math.random()
    }
    console.log(person.id)
    const nameExists = persons.some((person) => person.name === newName)
    const numberExists = persons.some((person) => person.number === newNumber)

    if (numberExists) {
      window.alert(`${newNumber} is already added to the phonebook`)
    } else if (nameExists) {
      const oldContact = persons.find((person) => person.name === newName)
      if (
        window.confirm(
          `${oldContact.name} is already added to the phonebook. Replace the old number with the new one?`
        )
      ) {
        personService
          .deleteThisPerson(oldContact.id)
          .then(() => {
            const updatedPerson = {
              ...person,
              id: oldContact.id 
            }
            personService.create(updatedPerson).then((returnData) => {
              setPersons(
                persons.map((p) =>
                  p.id === oldContact.id ? returnData : p)
              )
              setMessage(
                {message: `Note '${person.name}' added`,
                type: "success"
              })
              setTimeout(() => {
              setMessage(null)
            }, 3000)
            })
          })
      }
    } else {
      personService
        .create(person)
        .then((returnData) => {
          setPersons(persons.concat(returnData))
          setMessage(
            {message: `Note '${person.name}' added`,
            type: "success"
          })
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        });
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (event) => {
    event.preventDefault()
  
    const person = persons.find((person) => person.id === personId)
  
    if(window.confirm(`Delete ${person.name}?`)) 
    personService.deleteThisPerson(person.id).then(() => {
      setPersons(persons.filter((p) => p.id !== personId))
    })
    .catch(error => {
      setMessage(
        {message: `Note '${person.name}' was already removed from server`,
        type: "error"
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })
  }

  const filteredPersons = persons.filter(person =>
      person.name.toLowerCase().includes(filter.toLowerCase())
  )

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }   

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleDeletion = (id) => {
    deleteId(id)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={newMessage?.message} type={newMessage?.type}/>
      <Filter handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <div>
        <PersonForm 
        newName={newName}
        newNumber={newNumber}
        handleNewName={handleNewName}
        handleNewNumber={handleNewNumber}
        handleSubmit={addPerson}
        />
      </div>
      <h2>Numbers</h2>
      {filteredPersons.map(person => 
        <Display 
          key={person.id} 
          id={person.id}
          name={person.name} 
          number={person.number}
          handleDeletion={handleDeletion}
          handeleSubmit={deletePerson}/>
      )}
    </div>
  )

}

export default App