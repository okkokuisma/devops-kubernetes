import React, { useState } from 'react'

const TodoList = ({ todos }) => {
  const [todo, setTodo] = useState('')

  return (
    <div>
      <input type='text' value={todo} onChange={e => setTodo(e.target.value)} />
      <button>create TODO</button>
      <ul>
        {todos.map(todo => (
          <li>{todo}</li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList