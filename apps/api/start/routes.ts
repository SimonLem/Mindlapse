import router from '@adonisjs/core/services/router'

const LogoutController = () => import('#controllers/auth/logout_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const RegisterController = () => import('#controllers/auth/register_controller.js')

router
  .group(() => {
    router.post('register', [RegisterController, 'store']).as('auth.register')

    router.post('login', [LoginController, 'store']).as('auth.login')

    router
      .delete('logout', [LogoutController, 'destroy'])
      .use([() => import('@adonisjs/auth/middleware/auth')])
      .as('auth.logout')
  })
  .prefix('/api')
  .prefix('/v1')
  .prefix('/auth')

// Health/root
router.get('/', async () => ({ hello: 'world' }))
