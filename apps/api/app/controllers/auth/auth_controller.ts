import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  /** GET /api/v1/auth/me*/
  async me({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Not authenticated' })
    }
    return response.ok({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    })
  }
}
