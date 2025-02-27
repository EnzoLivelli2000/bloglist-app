import { useEffect, useState } from 'react'
import './App.css'
import Form from './components/form'
import Persons from './components/persons'
import Filter from './components/filter'
import personServer from './services/persons'

function App() {
  const [persons, setPersons] = useState([])
  const [filterPersons, setFilterPersons] = useState()
  const [newName, setNewName] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newFilter, setNewFilter] = useState("")

  useEffect(() => {
    personServer.getAll().then(initialPersons => {
      setPersons(initialPersons)
    }).catch(error => {
      alert('Error (getAll services)')
    })
  },[])

  const handleKeyName = (event) => setNewName(event.target.value)
  const handleKeyPhone = (event) => setNewPhone(event.target.value)

  const addName = (event) => {
    event.preventDefault();
    const nameObject = {
      name: newName,
      number: newPhone
    }
    const person = persons.find((p) => p.name === nameObject.name)

    if (person) {

      alert(nameObject.name + ' is already added to phonebook, the phone number will updated');

      personServer.update(person.id, nameObject).then(response => {
        setPersons(persons.map(p => p.id == person.id ? response : p))
      })

    } else {
      personServer.create(nameObject).then(response => {
        setPersons(persons.concat(response))
      }).catch(error => {
        // está es la forma de acceder al mensaje de error
        alert(error.response.data.error);
        console.log(error.response.data.error)
      })
    }
    setNewName("")
    setNewPhone("")
  }

  const onFilterChange = (event) => {
    setNewFilter(event.target.value)
    setFilterPersons(persons.find(person => person.name == event.target.value))
  }

  const onDeleted = (id) => {
    console.log(id)
    personServer.deletebyId(id).then(() => {
      setPersons(persons.filter(p => p.id !== id))
    }).catch(error => {
      alert('Error (deletebyId services)')
    })
  }

  const showPersons = filterPersons?[filterPersons]:persons

  return (
    <>
      <h1>PhoneBook</h1>
      <h3>Filter a name</h3>
      <Filter filter={newFilter} onFilterChange={onFilterChange} />
      <h3>Add a new</h3>
      <Form addName={addName} handleKeyName={handleKeyName} handleKeyPhone={handleKeyPhone} newName={newName} newPhone={newPhone} />
      <h3>Numbers</h3>
      <ul>
        {showPersons.map(p =>
          <Persons key={p.id} persons={p} onDeleted={() => onDeleted(p.id)} />
        )}
      </ul>
    </>
  )
}

export default App
