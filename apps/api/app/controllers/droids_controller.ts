import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { droidsIndexSchema, droidsCreateSchema, droidsUpdateSchema } from '#validators/droids'
import Droid from '#models/droid'
import type { Droid as DroidType } from '@repo/types'

function slugify(input: string) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

/** Normalise un Droid Lucid vers le type frontend (price:number, dates ISO) */
function serialize(d: Droid): DroidType {
  const json = d.toJSON() as any
  return {
    id: json.id,
    name: json.name,
    slug: json.slug,
    description: json.description ?? null,
    type: json.type,
    maker: json.maker,
    price: typeof json.price === 'string' ? Number(json.price) : (json.price ?? 0),
    stock: json.stock ?? 0,
    imageUrl: json.imageUrl ?? json.image_url ?? null,
    createdAt: (json.createdAt ?? json.created_at)?.toString?.() ?? new Date().toISOString(),
    updatedAt: (json.updatedAt ?? json.updated_at)?.toString?.() ?? new Date().toISOString(),
  }
}

export default class DroidsController {
  /** GET /api/v1/droids */
  async index({ request, response }: HttpContext) {
    const qs = await vine.validate({ schema: droidsIndexSchema, data: request.qs() })

    const page = qs.page ?? 1
    const pageSize = Math.min(qs.pageSize ?? 10, 100)

    const query = Droid.query().orderBy('created_at', 'desc')

    if (qs.q) {
      query.where((b) => b.whereILike('name', `%${qs.q}%`).orWhereILike('description', `%${qs.q}%`))
    }
    if (qs.type) query.where('type', qs.type)
    if (qs.inStock) query.where('stock', '>', 0)

    const paged = await query.paginate(page, pageSize)
    const json = paged.toJSON()

    return response.ok({
      items: (json.data as Droid[]).map(serialize),
      total: json.meta.total,
      page: json.meta.currentPage,
      pageSize: json.meta.perPage,
    })
  }

  /** POST /api/v1/droids */
  async store({ request, response }: HttpContext) {
    const body = await vine.validate({ schema: droidsCreateSchema, data: request.all() })

    // slug unique (simple stratégie : slug de base + suffixe si collision)
    let baseSlug = slugify(body.name)
    let slug = baseSlug
    let i = 1
    while (await Droid.findBy('slug', slug)) {
      slug = `${baseSlug}-${++i}`
    }

    const created = await Droid.create({
      name: body.name,
      slug,
      description: body.description ?? null,
      type: body.type,
      maker: body.maker,
      price: body.price,
      stock: body.stock,
      imageUrl: body.imageUrl ?? null,
    })

    return response.created(serialize(created))
  }

  /** PUT /api/v1/droids/:id */
  async update({ params, request, response }: HttpContext) {
    const id = Number(params.id)
    const droid = await Droid.findOrFail(id)

    const patch = await vine.validate({ schema: droidsUpdateSchema, data: request.all() })

    // Regénérer le slug si le nom change (et pas explicitement fourni)
    if (patch.name && !('slug' in patch)) {
      let baseSlug = slugify(patch.name)
      let slug = baseSlug
      let i = 1
      while (await Droid.query().where('slug', slug).whereNot('id', id).first()) {
        slug = `${baseSlug}-${++i}`
      }
      ;(patch as any).slug = slug
    }

    droid.merge(patch as any)
    await droid.save()

    return response.ok(serialize(droid))
  }

  /** DELETE /api/v1/droids/:id */
  async destroy({ params, response }: HttpContext) {
    const id = Number(params.id)
    const droid = await Droid.findOrFail(id)
    await droid.delete()
    return response.noContent()
  }
}
