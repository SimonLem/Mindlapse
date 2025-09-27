import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'

export default class extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const email = 'admin@mindlapse.local'
    const password = await hash.make('admin')

    await db.table('users').insert({
      full_name: 'Admin',
      email,
      password,
      created_at: new Date(),
      updated_at: new Date(),
    })
  }
}
