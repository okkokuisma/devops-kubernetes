import axios from 'axios'
const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/todos`

export const getAllTodos = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const createTodo = async (todo) => {
  console.log(todo)
  const response = await axios.post(baseUrl, todo)
  return response.data
}

export const toggleDone = async (id) => {
  const response = await axios.put(`${baseUrl}/${id}`)
  return response.data
}

const exportedObject =  { getAllTodos, createTodo, toggleDone }

export default exportedObject