import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const LoginController = () => import('#controllers/auth/login_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const DroidsController = () => import('#controllers/droids_controller')
const AuthController = () => import('#controllers/auth/auth_controller')

// Auth
router
  .group(() => {
    router.post('register', [RegisterController, 'store']).as('auth.register')
    router.post('login', [LoginController, 'store']).as('auth.login')
    router.get('me', [AuthController, 'me']).as('auth.me').use(middleware.auth())
    router.delete('logout', [LogoutController, 'handle']).as('auth.logout').use(middleware.auth())
  })
  .prefix('/api/v1/auth')

// Droids (session required)
router
  .group(() => {
    router.get('droids', [DroidsController, 'index']).as('droids.index')
    router.post('droids', [DroidsController, 'store']).as('droids.store')
    router.put('droids/:id', [DroidsController, 'update']).as('droids.update')
    router.delete('droids/:id', [DroidsController, 'destroy']).as('droids.destroy')
  })
  .prefix('/api/v1')
  .use(middleware.auth())

// Health/root
router.get('/', async () => ({ hello: 'world' }))
