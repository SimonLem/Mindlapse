// start/routes.ts
import router from '@adonisjs/core/services/router'

const LogoutController = () => import('#controllers/auth/logout_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const ProductsController = () => import('#controllers/products_controller')
const Auth = () => import('#middleware/auth_middleware')

// Auth
router
  .group(() => {
    router.post('register', [RegisterController, 'store']).as('auth.register')
    router.post('login', [LoginController, 'store']).as('auth.login')

    // router
    //   .delete('logout', [LogoutController, 'destroy'])
    //   .use([() => import('@adonisjs/auth/middleware/auth')])
    //   .as('auth.logout')
  })
  .prefix('/api/v1/auth')

// Products (session required)
router
  .group(() => {
    router.get('products', [ProductsController, 'index']).as('products.index')
  })
  .prefix('/api/v1')
  .use([Auth])

// Health/root
router.get('/', async () => ({ hello: 'world' }))
