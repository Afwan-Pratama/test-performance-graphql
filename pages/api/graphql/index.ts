import { ApolloServer } from '@apollo/server'
import { createContext } from '../../../graphql/context'
import { resolvers } from '../../../graphql/resolvers'
import { schema } from '../../../graphql/schema'
import { startServerAndCreateNextHandler } from '@as-integrations/next'

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

const server = new ApolloServer({ schema, resolvers })

export default startServerAndCreateNextHandler(server, {
  context: createContext,
})
