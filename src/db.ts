import { Sequelize } from 'sequelize'
import { videoModel } from './models/video'

const sequelize = new Sequelize({
  host: process.env.RDS_ENDPOINT,
  port: parseInt(process.env.RDS_PORT as string),
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  dialect: 'mysql'
})

const video = videoModel(sequelize)
const Models = { video }
const connection: {isConnected?: boolean} = {}

export const connectDb = async () => {
  console.log('trying db connect')
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
