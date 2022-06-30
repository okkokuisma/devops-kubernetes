import React, { useState } from 'react'
import { createTodo } from '../services/todoService'

const TodoList = ({ todos, setTodos }) => {
  const [todo, setTodo] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    createTodo({
      content: todo,
    })
    setTodos(todos.concat(todo))
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='text' value={todo} onChange={e => setTodo(e.target.value)} />
        <button type='submit'>create TODO</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li>{todo}</li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList