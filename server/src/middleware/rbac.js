import AppError from '../utils/AppError.js'

const ROLE_HIERARCHY = {
  admin: 3,
  manager: 2,
  employee: 1,
}

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401))
    }

    const userLevel = ROLE_HIERARCHY[req.user.role] ?? 0
    const hasAccess = roles.some((role) => userLevel >= ROLE_HIERARCHY[role])

    if (!hasAccess) {
      return next(new AppError('You do not have permission to perform this action', 403))
    }

    next()
  }
}

export const isAdmin = requireRole('admin')
export const isManager = requireRole('manager')