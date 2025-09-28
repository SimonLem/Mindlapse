import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export type DroidType = 'PROTOCOL' | 'COMBAT' | 'PILOT' | 'ASTROMECH' | 'MEDICAL' | 'REPAIR'

export default class Droid extends BaseModel {
  public static table = 'droids'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare type: DroidType

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
