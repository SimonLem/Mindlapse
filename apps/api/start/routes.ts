import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const LoginController = () => import('#controllers/auth/login_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const DroidsController = () => import('#controllers/droids_controller')

// Auth
router
  .group(() => {
    router.post('register', [RegisterController, 'store']).as('auth.register')
    router.post('login', [LoginController, 'store']).as('auth.login')
  })
  .prefix('/api/v1/auth')

// Droids (session required)
router
  .group(() => {
    router.get('droids', [DroidsController, 'index']).as('droids.index')
  })
  .prefix('/api/v1')
  .use(middleware.auth())

// Health/root
router.get('/', async () => ({ hello: 'world' }))
