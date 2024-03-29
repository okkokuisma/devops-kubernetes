const { Sequelize } = require('sequelize')
const DB_CONNECTION_RETRY_LIMIT = 10
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const username = process.env.POSTGRES_USER
const password = process.env.POSTGRES_PASSWORD
const database = process.env.POSTGRES_DB
const host = process.env.DB_HOST
const port = process.env.DB_PORT

// 'postgres://postgres:postgres@localhost:5432/postgres'
// const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/postgres')
const sequelize = new Sequelize(`postgres://${username}:${password}@${host}:${port}/${database}`)

const Todo = require('./models/Todo')(sequelize, Sequelize.DataTypes)

const connectToDatabase = async (attempt = 0) => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    console.log('Connected to database')
  }
  catch (e) {
    if (attempt === DB_CONNECTION_RETRY_LIMIT) {
      console.log(`Connection to database failed after ${attempt} attempts`)
      process.exit(1)
    }

    console.log(e)
    console.log(
      `Connection to database failed! Attempt ${attempt} of ${DB_CONNECTION_RETRY_LIMIT}`,
    )

    await sleep(3000)
    connectToDatabase(attempt + 1)
  }
}

const checkDbConnection = async () => {
  try {
    await sequelize.authenticate()
    return true
  } catch (error) {
    return false
  }
}

module.exports = { connectToDatabase, checkDbConnection, Todo }