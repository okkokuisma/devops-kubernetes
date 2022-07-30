const Todo = require('./dbInit').Todo
const nats = require('../nats/nats').publishToNats

const getAll = async () => {
  return await Todo.findAll()
}

const create = async (values) => {
  const todo = await Todo.create(values)
  nats.then(publish => publish({todo: {...todo.dataValues}, pubType: 'created'}))
  return todo
}

const toggleDone = async (todoId) => {
  const todo = await Todo.findOne({ where: { id: todoId } })

  if (!todo) return null

  todo.set({ done: !todo.done })
  await todo.save()
  nats.then(publish => publish({todo: {...todo.dataValues}, pubType: 'modified'}))
  return todo
}

module.exports = { create, getAll, toggleDone }