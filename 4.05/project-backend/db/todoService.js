const Todo = require('./dbInit').Todo

const getAll = async () => {
  return await Todo.findAll()
}

const create = async (values) => {
  return await Todo.create(values)
}

const toggleDone = async (todoId) => {
  const todo = await Todo.findOne({ where: { id: todoId } })

  if (!todo) return null

  todo.set({ done: !todo.done })
  await todo.save()
  return todo
}

module.exports = { create, getAll, toggleDone }