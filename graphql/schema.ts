import { makeSchema } from 'nexus'
import * as path from 'path'
import * as types from './types'

export const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(process.cwd(), 'graphql/schema.graphql'),
    typegen: path.join(
      process.cwd(),
      'node_modules',
      '@types',
      'nexus-typegen',
      'index.d.ts'
    ),
  },
  contextType: {
    module: path.join(process.cwd(), 'graphql', 'context.ts'),
    export: 'Context',
  },
})

// import { gql } from 'graphql-tag'

// export const typeDefs = gql`
//   type Link {
//     id: String
//     title: String
//     description: String
//     url: String
//     category: String
//     imageUrl: String
//     users: [String]
//   }

//   type Query {
//     links: [Link]!
//   }
// `
