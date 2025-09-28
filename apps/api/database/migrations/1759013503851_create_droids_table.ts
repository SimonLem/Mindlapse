import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'droids'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.text('description').nullable()
      table
        .enum('type', ['PROTOCOL', 'COMBAT', 'PILOT', 'ASTROMECH', 'MEDICAL', 'REPAIR'], {
          useNative: true,
          enumName: 'droid_type',
        })
        .notNullable()
      table
        .enum(
          'maker',
          [
            'INDUSTRIAL_AUTOMATON',
            'CYBOT_GALACTIC',
            'KUAT_SYSTEMS_ENGINEERING',
            'HOLOWAN_ARMAMENT',
          ],
          {
            useNative: true,
            enumName: 'droid_maker',
          }
        )
        .notNullable()
      table.decimal('price', 10, 2).notNullable().defaultTo(0)
      table.integer('stock').notNullable().defaultTo(0)
      table.string('image_url').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS droid_type')
    this.schema.raw('DROP TYPE IF EXISTS droid_maker')
  }
}
