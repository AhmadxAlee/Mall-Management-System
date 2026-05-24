import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../../config/db.js'
import AppError from '../../utils/AppError.js'
import catchAsync from '../../utils/catchAsync.js'

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

const sendAuthResponse = (user, statusCode, res) => {
  const token = signToken(user.id)
  const { password_hash, ...userWithoutPassword } = user

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user: userWithoutPassword },
  })
}

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body

  const { rows: existing } = await query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  )
  if (existing.length) {
    return next(new AppError('Email already in use', 409))
  }

  const password_hash = await bcrypt.hash(password, 12)

  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, password_hash, role]
  )

  sendAuthResponse(rows[0], 201, res)
})

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  const { rows } = await query(
    'SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = $1',
    [email]
  )

  if (!rows.length) {
    return next(new AppError('Invalid email or password', 401))
  }

  const user = rows[0]

  if (!user.is_active) {
    return next(new AppError('Your account has been deactivated', 403))
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash)
  if (!isPasswordValid) {
    return next(new AppError('Invalid email or password', 401))
  }

  sendAuthResponse(user, 200, res)
})

export const getMe = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  })
})