// /graphql/types/Link.ts
import { objectType, extendType, nonNull, stringArg } from 'nexus'

import { Supplier } from 'nexus-prisma'

export const SupplierType = objectType({
  name: Supplier.$name,
  definition(t) {
    t.field(Supplier.id)
    t.field(Supplier.name)
    t.field(Supplier.description)
    t.field(Supplier.address)
    t.field(Supplier.product)
  },
})

export const SuppliersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('suppliers', {
      type: 'Supplier',
      resolve: (_parent, _args, ctx) => {
        console.log(
          'memory usage :',
          process.memoryUsage().heapUsed / 1024 / 1024,
          'MB'
        )
        return ctx.prisma.supplier.findMany()
      },
    })
  },
})

export const CreateSupplierMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createSupplier', {
      type: 'Supplier',
      args: {
        name: nonNull(stringArg()),
        address: nonNull(stringArg()),
        description: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        const newSupplier = {
          name: args.name,
          address: args.address,
          description: args.description,
        }
        return await ctx.prisma.supplier.create({
          data: newSupplier,
        })
      },
    })
  },
})
