import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

const Button = ({ onHandler, text }) => (
  <button onClick={onHandler}>{text}</button>
)
const Statistics = ({ average, all, good }) => {
  const averageTotal = average / all ? average / all : 0
  const positiveTotal = good / all * 100 ? good / all * 100 : 0

  return (
    <table>
      <tbody>
        <tr>
          <td>
            average {averageTotal}
          </td>
        </tr>
        <tr>
          <td>
            positive {positiveTotal} %
          </td>
        </tr>
      </tbody>
    </table>
  )
}

const StatisticsLine = ({ value, text }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>
            {text} {value}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

const MostedVote = ({ copy , anecdotes}) => {
  const mostedVote = Math.max(...copy) - 1
  console.log(mostedVote)
  return (
    <div>
      <h1>The anecdotes with most votes</h1>
      <p>{anecdotes[mostedVote]}</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const points = [0,0,0,0,0,0,0,0]
  const copy = [...points]

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [selected, setSelected] = useState(0)
  const [mosted, setMosted] = useState(0)

  const handleGood = () => {
    let value = good + 1
    setGood(value)
    setAll(value + neutral + bad)
    setAverage(average + 1)
    console.log('good', good)
  }

  const handleNuetral = () => {
    let value = neutral + 1
    setNeutral(value)
    setAll(good + value + bad)
    setAverage(average + 0)
    console.log('neutral', neutral)
  }

  const handleBad = () => {
    const value = bad + 1
    setBad(value)
    setAll(good + neutral + value)
    setAverage(average - 1)
    console.log('bad', bad)
  }
  const handleAnecdotes = () => {
    setSelected(selected + 1)
  }
  const handleVote = () => {
    console.log('selected', selected)
    copy[selected] += 1
    console.log('copy',copy)
    setMosted(Math.max(...copy)-1)
    console.log('max', Math.max(...copy)-1)
  }

  if (good == 0 && bad == 0 && neutral == 0) {
    return (
      <div>
        <h1>give feedback</h1>
        <div>
          <Button onHandler={handleGood} text='good' />
          <Button onHandler={handleNuetral} text='neutral' />
          <Button onHandler={handleBad} text='bad' />
        </div>
        <p>No feedback given</p>
        <h1>anecdotes</h1>
        <div>
          <p>{anecdotes[selected]}</p>
          <Button onHandler={handleAnecdotes} text={'next anecdotes'} />
          <Button onHandler={handleVote} text={'vote'} />
          <p>{anecdotes[mosted]}</p>
        </div>
      </div>
    )
  }
  return (
    <div>
      <h1>give feedback</h1>

      <div>
        <Button onHandler={handleGood} text='good' />
        <Button onHandler={handleNuetral} text='neutral' />
        <Button onHandler={handleBad} text='bad' />
      </div>
      <h1>statistics</h1>
      <div>
        <StatisticsLine text={'good'} value={good} />
        <StatisticsLine text={'neutral'} value={neutral} />
        <StatisticsLine text={'bad'} value={bad} />
        <StatisticsLine text={'all'} value={all} />
        <Statistics average={average} all={all} good={good} />
      </div>
      <h1>anecdotes</h1>
      <div>
        <p>{anecdotes[selected]}</p>
        <Button onHandler={handleAnecdotes} text={'next anecdotes'} />
        <Button onHandler={handleVote} text={'vote'} />
        <p>{anecdotes[mosted]}</p>
      </div>
    </div>
  )
}

export default App
