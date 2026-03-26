import { MongoMemoryServer } from 'mongodb-memory-server'

export default async function globalSetup() {
  const instance = await MongoMemoryServer.create({
    binary: {
      verison: '6.0.4',
    },
  })

  global._MONGOINSTANCE = instance
  process.env.DATABASE_URL = instance.getUri()
}
