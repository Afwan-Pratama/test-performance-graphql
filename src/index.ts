import { PrismaClient } from '@prisma/client'

import express from 'express'

import { graphqlHTTP } from 'express-graphql'

import { makeExecutableSchema } from '@graphql-tools/schema'

const prisma = new PrismaClient()

const typeDefs = `

  type Link {

   id : String!

   title : String

   url : String

   description : String

   imageUrl : String

   category : String

  }


  type Query {

    links: [Link!]!

  }

`

const resolvers = {
  Query: {
    links: () => {
      return prisma.link.findMany()
    },
  },
}

export const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
})

const app = express()

app.use((req, res, next) => {
  const startHrTime = process.hrtime()

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime)
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6
    console.log('%s : %fms', req.path, elapsedTimeInMs)
  })

  next()
})

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
  })
)

app.listen(4000)
