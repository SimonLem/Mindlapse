import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import logger from '@adonisjs/core/services/logger'

export default class ProductsController {
  /**
   * GET /api/v1/products
   * Query params:
   *  - page (default 1), pageSize (default 10)
   *  - q (search name/description)
   *  - type (filter enum)
   *  - inStock=true (stock > 0)
   */
  async index({ request, response }: HttpContext) {
    logger.info({ qs: request.qs() }, 'Fetching products list')
    const page = Number(request.input('page', 1))
    const pageSize = Math.min(Number(request.input('pageSize', 10)), 100)
    const q = (request.input('q') ?? '').toString().trim()
    const type = (request.input('type') ?? '').toString().trim().toUpperCase()
    const inStock = request.input('inStock') === 'true'

    const query = Product.query().orderBy('created_at', 'desc')

    if (q) {
      query.where((builder) => {
        builder.whereILike('name', `%${q}%`).orWhereILike('description', `%${q}%`)
      })
    }

    if (type) {
      query.where('type', type)
    }

    if (inStock) {
      query.where('stock', '>', 0)
    }

    const result = await query.paginate(page, pageSize)
    const json = result.toJSON()

    return response.ok({
      items: json.data,
      total: json.meta.total,
      page: json.meta.currentPage,
      pageSize: json.meta.perPage,
    })
  }
}
