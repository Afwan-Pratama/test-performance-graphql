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

export const ProductsQueryWithFiltering = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('productsWithFiltering', {
      type: 'Product',
      args: {
        id: stringArg(),
        name: stringArg(),
        material: stringArg(),
        supplierId: stringArg(),
      },
      resolve: async (root, arg, ctx) => {
        return ctx.prisma.product.findMany({
          where: {
            OR: [
              { id: arg.id ?? undefined },
              { name: arg.name ?? undefined },
              { material: arg.material ?? undefined },
              { supplierId: arg.material ?? undefined },
            ],
          },
        })
      },
    })
  },
})

export const CreateProductMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createProduct', {
      type: 'Product',
      args: {
        name: nonNull(stringArg()),
        material: nonNull(stringArg()),
        imageUrl: nonNull(stringArg()),
        price: nonNull(stringArg()),
        description: nonNull(stringArg()),
        supplierId: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        const newProduct = {
          name: args.name,
          material: args.material,
          imageUrl: args.imageUrl,
          price: args.price,
          description: args.description,
          supplierId: args.supplierId,
        }
        return await ctx.prisma.product.create({
          data: newProduct,
        })
      },
    })
  },
})

export const UpdateProductMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updateProduct', {
      type: 'Product',
      args: {
        id: nonNull(stringArg()),
        name: stringArg(),
        material: stringArg(),
        imageUrl: stringArg(),
        price: stringArg(),
        description: stringArg(),
        supplierId: stringArg(),
      },
      resolve: async (root, args, ctx) => {
        type dictionaryProduct = { [index: string]: string | null | undefined }

        const newProduct: dictionaryProduct = {
          name: args.name?.toLowerCase(),
          material: args.material?.toLowerCase(),
          imageUrl: args.imageUrl,
          price: args.price,
          description: args.description?.toLowerCase(),
          supplierId: args.supplierId,
        }

        const obj: dictionaryProduct = {}

        for (let i = 0; i < Object.keys(newProduct).length; i++) {
          const indexObj: string = Object.keys(newProduct)[i]
          if (newProduct[indexObj]) {
            obj[indexObj] = newProduct[indexObj]
          }
        }

        return ctx.prisma.product.update({
          data: obj,
          where: {
            id: args.id ?? '',
          },
        })
      },
    })
  },
})

export const DeleteProductMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('deleteProduct', {
      type: 'Product',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (root, args, ctx) => {
        return ctx.prisma.product.delete({
          where: {
            id: args.id,
          },
        })
      },
    })
  },
})
