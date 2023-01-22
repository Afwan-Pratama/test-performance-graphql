// /graphql/types/Link.ts
import { objectType, extendType, nonNull, stringArg, arg } from 'nexus'

export const Supplier = objectType({
  name: 'Supplier',
  definition(t) {
    t.nonNull.string('id')
    t.string('name')
    t.string('description')
    t.string('address')
  },
})

export const SuppliersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('suppliers', {
      type: 'Supplier',
      resolve: async (_parent, _args, ctx) => {
        return ctx.prisma.supplier.findMany()
      },
    })
  },
})

export const CreateSupplierMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createSupplier', {
      type: Supplier,
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
