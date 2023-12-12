import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {

  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const filteredList = anecdotes.filter(a => 
      a.content.toLowerCase().includes(filter.toLowerCase()))
    return filteredList.sort((a, b) => b.votes - a.votes)
  })

  const addVote = (id) => {
    dispatch(vote(id))
  }

  return(
      anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => addVote(anecdote.id)}>vote</button>
          </div>
        </div>
      )
  )
}

export default AnecdoteList