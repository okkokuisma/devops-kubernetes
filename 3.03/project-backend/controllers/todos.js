const todoRouter = require('express').Router()
const todoService = require('../db/todoService')

const validateInput = (input) => {
  if (!input || /^\s*$/.test(input) || input.length > 140) return false
  return true
}

todoRouter.post('/', async (req, res) => {
  console.log(`${new Date()}: ${req.body.content}`)
  if (validateInput(req.body.content)) {
    const createdTodo = await todoService.create({ content: req.body.content })
    res.status(201).json(createdTodo)
  } else {
    res.status(400).send('Todos must be under 140 characters long.')
  }
})

todoRouter.get('/', async (req, res) => {
  const todos = await todoService.getAll()
  res.status(200).json(todos)
})

module.exports = todoRouter