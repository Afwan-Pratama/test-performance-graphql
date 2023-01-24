import { ApolloServer } from '@apollo/server'
import { createContext } from '../../../graphql/context'
import { schema } from '../../../graphql/schema'
import { startServerAndCreateNextHandler } from '@as-integrations/next'

const server = new ApolloServer({ schema })

export default startServerAndCreateNextHandler(server, {
  context: createContext,
})

console.log(process.cpuUsage().user / 1000)
console.log(process.memoryUsage().heapUsed / 1024 / 1024)
