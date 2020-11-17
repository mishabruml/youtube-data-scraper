import { Sequelize } from 'sequelize'
import { videoModel } from './models/video'
import config from './config'

const { aws: { rds } } = config

const sequelize = new Sequelize({
  host: rds.endpoint,
  port: rds.port,
  username: rds.username,
  password: rds.password,
  database: rds.databasename,
  dialect: 'mysql'
})

const video = videoModel(sequelize)
const Models = { video }
const connection: {isConnected?: boolean} = {}

export const connectDb = async () => {
  if (connection.isConnected) {
    console.log('Sequelize using existing connection.')
    return Models
  }

  await sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err)
    })
  console.log('trying sync')
  await sequelize.sync()
  // await sequelize.authenticate()
  connection.isConnected = true
  console.log('Sequelize created a new connection.')
  return Models
}
