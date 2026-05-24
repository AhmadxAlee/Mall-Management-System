import { Router } from 'express'
import { register, login, getMe } from './auth.controller.js'
import validate from '../../middleware/validate.js'
import auth from '../../middleware/auth.js'
import { registerSchema, loginSchema } from './auth.schema.js'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.get('/me', auth, getMe)

export default router