import {useField, useAnotherHook} from "./hooks/useInput"

const App = () => {
  const name = useField('text')
  const username = useField('text')
  const born = useField('date')
  const height = useField('number')

  const handleReset = () => {
    name.reset()
    username.reset()
    born.reset()
    height.reset()
  }

  return (
    <div>
      <form>
        name:
        <input  {...name} />
        <br />
        username:
        <input  {...username} />
        <br />
        birthdate:
        <input {...born} />
        <br />
        height:
        <input {...height} />
      </form>
      <div>
        {name.value} - {username.value} - {born.value} - {height.value}
      </div>
     <div><button>create</button> <button onClick={handleReset}>reset</button></div> 
    </div>
  )
}

export default App