const Header = (props) => {
  return (
    <div>
      <h1>{props.name}</h1>
    </div>
  )
}

const Part = (parts) => {
  return (
    <div> 
      <p>{parts.name} credits are {parts.tasks}</p>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part name={props.exercise[0].part} tasks={props.exercise[0].exercises} />
      <Part name={props.exercise[1].part} tasks={props.exercise[1].exercises} />
      <Part name={props.exercise[2].part} tasks={props.exercise[2].exercises} />
      <Total sum={props.exercise[0].exercises + props.exercise[1].exercises
      + props.exercise[2].exercises}/>
    </div>
  )
}

const Total = (credits) => {
  return (
    <div>
      <p>Number of exercises {credits.sum}</p>
    </div>
  )
}


const App = () => {
  const course = 'Half Stack application development'

  const exercise = [
    { part: 'Half Stack application development', exercises: 10 },
    { part: 'Fundamentals of React', exercises: 7 },
    { part: 'State of a component', exercises: 14 }
  ]

  return (
    <div>
      <Header name={course} />
      <Content exercise={exercise} />
    </div>
  )
}

export default App