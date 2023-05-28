const Header = (props) => {
  console.log(props)
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

  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  
  return (
    <div>
      <Header name={course.name} />
      <Content exercise={course.parts} />
    </div>
  )
}

export default App