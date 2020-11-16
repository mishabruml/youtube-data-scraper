import { Sequelize, DataTypes, Model } from 'sequelize'

interface VideoInstance extends Model {
  id: number
  title: string
  date: string
}

export const videoModel = (sequelize: Sequelize) =>
  sequelize.define<VideoInstance>('video',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING(100)
      },
      date: {
        type: DataTypes.DATE
      }
    }
  )
