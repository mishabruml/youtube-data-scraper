import { promises as fs } from 'fs'
import { resolve } from 'path'

export const getSearchFilter = async (filename: string) => (await fs.readFile(resolve(__dirname, filename), 'utf8'))
  .toString()
  .split('\n')
