// /graphql/types/Link.ts
import { objectType, extendType, nonNull, stringArg, arg, intArg } from 'nexus'

export const Product = objectType({
  name: 'Product',
  definition(t) {
    t.nonNull.string('id')
    t.string('name')
    t.string('material')
    t.string('description')
    t.string('imageUrl')
    t.string('price')
    t.nonNull.string('supplierId')
    t.field('supplier', {
      type: 'Supplier',
      resolve: async (root, arg, ctx) => {
        const res: any = await ctx.prisma.supplier
          .findFirst({
            where: {
              id: root.supplierId ?? '',
            },
          })
          .product({
            where: {
              id: root.id,
            },
          })
        return res[0]
      },
    })
  },
})

export const ProductsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('products', {
      type: 'Product',
      resolve: async (_parent, _args, ctx) => {
        return ctx.prisma.product.findMany()
      },
    })
  },
})

export const ProductsQueryWithLimit = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('productsWithLimit', {
      type: 'Product',
      args: {
        limit: intArg(),
      },
      resolve: async (root, arg, ctx) => {
        return ctx.prisma.product.findMany({
          take: arg.limit ?? 0,
        })
      },
    })
  },
})

export const ProductsQueryWithPagination = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('productsWithPagination', {
      type: 'Product',
      args: {
        limit: intArg(),
        page: intArg(),
      },
      resolve: async (root, arg, ctx) => {
        const limit: number = arg.limit ?? 0
        const page: number = arg.page ?? 0
        return ctx.prisma.product.findMany({
          skip: limit * page + 1,
          take: limit,
        })
      },
    })
  },
})

export const CreateProductMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createProduct', {
      type: Product,
      args: {
        name: nonNull(stringArg()),
        material: nonNull(stringArg()),
        imageUrl: nonNull(stringArg()),
        price: nonNull(stringArg()),
        description: nonNull(stringArg()),
        supplierId: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        const newLink = {
          name: args.name,
          material: args.material,
          imageUrl: args.imageUrl,
          price: args.price,
          description: args.description,
          supplierId: args.supplierId,
        }
        return await ctx.prisma.product.create({
          data: newLink,
        })
      },
    })
  },
})
