import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export type ProductType =
  | 'PROTOCOLAIRE'
  | 'COMBAT'
  | 'PILOTAGE'
  | 'ASTROMECH'
  | 'MEDICAL'
  | 'REPAIR'

export default class Product extends BaseModel {
  public static table = 'products'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare type: ProductType

  @column()
  declare maker: string | null

  @column()
  declare price: string

  @column()
  declare stock: number

  @column()
  declare imageUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
