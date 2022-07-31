import React, { useState } from 'react'
import { createTodo, toggleDone } from '../services/todoService'

const TodoList = ({ todos, setTodos }) => {
  const [todo, setTodo] = useState('')

  const underlineStyle = { textDecoration: "line-through" }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (todo.length <= 140) {
      const createdTodo = await createTodo({
        content: todo,
      })
      setTodos(todos.concat(createdTodo))
    }
  }

  const handleTodoClick = async (id) => {
    const todo = await toggleDone(id)
    if (todo) {
      setTodos(todos.map(t => {
        return t.id === id ? todo : t
      }))
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
          <li onClick={() => handleTodoClick(todo.id)} key={todo.id}>
            <span style={todo.done ? underlineStyle : null}>{todo.content}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList