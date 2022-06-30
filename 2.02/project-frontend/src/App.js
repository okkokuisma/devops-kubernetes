import React, { useEffect, useState } from 'react'
import TodoList from './components/todoList'
import { getAllTodos } from './services/todoService'
const baseUrl = process.env.REACT_APP_BACKEND_URL

const App = () => {
  const [img, setImg] = useState()
  const [todos, setTodos] = useState([])

  const fetchDailyImage = async () => {
    const res = await fetch(`${baseUrl}/image`)
    const imageBlob = await res.blob()
    const imageObjectURL = URL.createObjectURL(imageBlob)
    setImg(imageObjectURL)
  };

  useEffect(() => {
    async function fetchData() {
      await fetchDailyImage()
      const fetchedTodos = await getAllTodos()
      console.log(fetchedTodos)
      setTodos(fetchedTodos)
    }
    fetchData();
  }, [])

  return (
    <>
      <img src={img} alt='dailyImage' />
      <TodoList todos={todos} setTodos={setTodos} />
    </>
  )
}

export default App
