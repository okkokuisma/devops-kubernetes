const Todo = require('./dbInit').Todo

const getAll = async () => {
  return await Todo.findAll()
}

const create = async (values) => {
  return await Todo.create(values)
}

module.exports = { create, getAll }