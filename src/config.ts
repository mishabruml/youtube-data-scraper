import convict from 'convict'

const config = convict({
  aws: {
    rds: {
      endpoint: {
        env: 'RDS_ENDPOINT',
        default: undefined
      },
      port: {
        env: 'RDS_PORT',
        format: Number,
        default: undefined
      },
      username: {
        env: 'RDS_USERNAME',
        default: undefined
      },
      password: {
        env: 'RDS_PASSWORD',
        default: undefined
      },
      databasename: {
        env: 'RDS_DB_NAME',
        default: 'mydb'
      }
    },
    sqs: {
      scrapeVideosQueueUrl: {
        env: 'SCRAPE_VIDEOS_REQUEST_QUEUE_URL',
        format: String,
        default: ''
      },
      storeVideosQueueUrl: {
        env: 'STORE_VIDEOS_QUEUE_URL',
        format: String,
        default: ''
      }
    }
  },
  googleApiKey: {
    env: 'GOOGLE_API_KEY',
    format: String,
    default: ''

  },
  searchFilterFilename: {
    env: 'SEARCH_FILTER_FILENAME',
    format: String,
    default: 'search_filter'
  }
}).getProperties()

export default config
