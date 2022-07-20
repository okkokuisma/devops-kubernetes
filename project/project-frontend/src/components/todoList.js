import React, { useState } from 'react'
import { createTodo } from '../services/todoService'

const TodoList = ({ todos, setTodos }) => {
  const [todo, setTodo] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (todo.length <= 140) {
      const createdTodo = await createTodo({
        content: todo,
      })
      setTodos(todos.concat(createdTodo))
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='text' value={todo} onChange={e => setTodo(e.target.value)} />
        <button type='submit'>create TODO</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList