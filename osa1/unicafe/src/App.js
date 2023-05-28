import { useState } from 'react'

const StatisticLine = ({text, value}) => {
  if (text === "pos") {
    return (
      <tr>
      <td>{text}</td>
      <td>{value} %</td>
    </tr>
    )
  }
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  if (good + neutral + bad === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
    }
    const avg = (good - bad)/(good + neutral + bad)
    const pos = good /(good + neutral + bad) * 100

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="avg" value={avg} />
        <StatisticLine text="pos" value={pos} />
      </tbody>
    </table>
  )
}

const Button = (props) => (
  <button 
    onClick={props.handleClick}>{props.text}
  </button>
)

const App = () => {
  // tallenna napit omaan tilaansa

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToGood = newValue => {
    console.log('value now', newValue)
    setGood(newValue)
  }

  const setToNeutral = newValue => {
    console.log('value now', newValue)
    setNeutral(newValue)
  }

  const setToBad = newValue => {
    console.log('value now', newValue)
    setBad(newValue)
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={() => setToGood(good + 1)} text="good"/>
      <Button handleClick={() => setToNeutral(neutral + 1)} text="neutral"/>
      <Button handleClick={() => setToBad(bad + 1)} text="bad"/>

      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
      
    </div>
  )
}

export default App;
