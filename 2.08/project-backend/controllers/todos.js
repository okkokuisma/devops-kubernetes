const todoRouter = require('express').Router()
const todoService = require('../db/todoService')

todoRouter.post('/', async (req, res) => {
  const createdTodo = await todoService.create({ content: req.body.content })
  res.status(201).json(createdTodo)
})

todoRouter.get('/', async (req, res) => {
  const todos = await todoService.getAll()
  res.status(200).json(todos)
})

module.exports = todoRouter