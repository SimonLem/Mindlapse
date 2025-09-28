import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { droidsIndexSchema } from '#validators/droids'
import Droid from '#models/droid'
import type { Droid as DroidType } from '@repo/types'

export default class DroidsController {
  async index({ request, response }: HttpContext) {
    const qs = await vine.validate({ schema: droidsIndexSchema, data: request.qs() })

    const page = qs.page ?? 1
    const pageSize = Math.min(qs.pageSize ?? 10, 100)

    const query = Droid.query().orderBy('created_at', 'desc')
    if (qs.q)
      query.where((b) => b.whereILike('name', `%${qs.q}%`).orWhereILike('description', `%${qs.q}%`))
    if (qs.type) query.where('type', qs.type)
    if (qs.inStock) query.where('stock', '>', 0)

    const paged = await query.paginate(page, pageSize)
    const json = paged.toJSON()

    return response.ok({
      items: json.data as DroidType[],
      total: json.meta.total,
      page: json.meta.currentPage,
      pageSize: json.meta.perPage,
    })
  }
}
