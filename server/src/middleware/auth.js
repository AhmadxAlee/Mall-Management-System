import jwt from 'jsonwebtoken'
import { query } from '../config/db.js'
import AppError from '../utils/AppError.js'
import catchAsync from '../utils/catchAsync.js'

const auth = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401))
  }

  const token = authHeader.split(' ')[1]

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return next(new AppError('Invalid or expired token', 401))
  }

  const { rows } = await query(
    'SELECT id, name, email, role FROM users WHERE id = $1 AND is_active = true',
    [decoded.id]
  )

  if (!rows.length) {
    return next(new AppError('User no longer exists', 401))
  }

  req.user = rows[0]
  next()
})

export default auth