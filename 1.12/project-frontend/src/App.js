import React, { useEffect, useState } from 'react'
import TodoList from './components/todoList'
const baseUrl = process.env.REACT_APP_BACKEND_URL

const App = () => {
  const [img, setImg] = useState()
  const todos = [
    'brush your teeth',
    'make some food',
    'practice playing the ukulele'
  ]

  const fetchDailyImage = async () => {
    const res = await fetch(`${baseUrl}/image`)
    const imageBlob = await res.blob()
    const imageObjectURL = URL.createObjectURL(imageBlob)
    setImg(imageObjectURL)
  };

  useEffect(() => {
    fetchDailyImage()
  }, [])

  return (
    <>
      <img src={img} alt='dailyImage' />
      <TodoList todos={todos} />
    </>
  )
}

export default App
