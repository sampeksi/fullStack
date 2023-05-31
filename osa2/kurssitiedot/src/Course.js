const Header = ({text}) => {
    return (
      <h2>
        {text}
      </h2>
    )
}
  
const Content = ({part}) => {
    return (
        <p>
          {part.name} {part.exercises}
        </p>
    )
}

const Total = ({parts}) => {
    const total = parts.reduce( (s,p) => {
      return s + p.exercises
    }, 0)
    
    return (
        <b>total of {total} exercises</b>
    )
  }
  
const Course = ({course}) => {
    return (
      <div>
          <Header text={course.name}/>
          {course.parts.map(part =>
            <Content key={part.id} part={part}/>
          )}
            <Total parts={course.parts}/>
      </div>
    )
}

export default Course