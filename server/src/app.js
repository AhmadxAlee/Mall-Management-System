import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import AppError from './utils/AppError.js'
import authRoutes from './modules/auth/auth.routes.js'
import employeeRoutes from './modules/employees/employees.routes.js'
import brandRoutes from './modules/brands/brands.routes.js'
import outletRoutes from './modules/outlets/outlets.routes.js'
import foodCourtRoutes from './modules/foodcourt/foodcourt.routes.js'
import productRoutes from './modules/products/products.routes.js'
import dashboardRoutes from './modules/dashboard/dashboard.routes.js'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api', limiter)

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/brands', brandRoutes)
app.use('/api/outlets', outletRoutes)
app.use('/api/foodcourt', foodCourtRoutes)
app.use('/api/products', productRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.all('*splat', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404))
})

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    })
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).json({ status: err.status, message: err.message })
    } else {
      console.error('UNEXPECTED ERROR:', err)
      res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
  }
})

export default app