import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  public static developmentOnly = true

  async run() {
    const now = new Date()
    await db.table('droids').insert([
      {
        name: 'R2-D2',
        slug: 'r2-d2',
        description: 'Droïde astromech légendaire, expert en réparations et navigation.',
        type: 'ASTROMECH',
        maker: 'INDUSTRIAL_AUTOMATON',
        price: 19999.99,
        stock: 5,
        image_url: null,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'C-3PO',
        slug: 'c-3po',
        description: 'Droïde protocolaire, plus de 6 millions de formes de communication.',
        type: 'PROTOCOL',
        maker: 'CYBOT_GALACTIC',
        price: 14999.0,
        stock: 3,
        image_url: null,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'BB-8',
        slug: 'bb-8',
        description: 'Astromech sphérique, agile et loyal.',
        type: 'ASTROMECH',
        maker: 'INDUSTRIAL_AUTOMATON',
        price: 15999.0,
        stock: 4,
        image_url: null,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'K-2SO',
        slug: 'k-2so',
        description: 'Droïde de sécurité impérial reprogrammé, idéal pour opérations de COMBAT.',
        type: 'COMBAT',
        maker: 'KUAT_SYSTEMS_ENGINEERING',
        price: 22999.0,
        stock: 2,
        image_url: null,
        created_at: now,
        updated_at: now,
      },
      {
        name: 'IG-88',
        slug: 'ig-88',
        description: 'Chasseur de primes droïde, armé jusqu’aux photorécepteurs.',
        type: 'COMBAT',
        maker: 'HOLOWAN_ARMAMENT',
        price: 34999.0,
        stock: 1,
        image_url: null,
        created_at: now,
        updated_at: now,
      },
    ])
  }
}
