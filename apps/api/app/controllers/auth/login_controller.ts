// app/Controllers/Http/Auth/LoginController.ts
import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async store({ request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    await auth.use('web').login(user)

    const accepts = request.header('accept') || ''
    const wantsJson = accepts.includes('application/json')

    if (wantsJson) {
      return response.ok({
        ok: true,
        user: { id: user.id, email: user.email, full_name: user.fullName },
      })
    }

    return response.redirect().toPath('/')
  }
}
