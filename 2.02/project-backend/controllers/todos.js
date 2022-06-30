const todoRouter = require('express').Router()

const todos = [
  'brush your teeth',
  'make some food',
  'practice playing the ukulele'
]

todoRouter.post('/', async (req, res) => {
  todos.push(req.body.content)
})

todoRouter.get('/', async (req, res) => {
  res.json(todos)
})

module.exports = todoRouter