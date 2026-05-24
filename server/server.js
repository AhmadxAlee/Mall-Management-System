import dotenv from 'dotenv'
dotenv.config()

import app from './src/app.js'
import pool from './src/config/db.js'

const PORT = process.env.PORT || 5000

const start = async () => {
  try {
    await pool.query('SELECT 1')
    console.log('✓ Database connected')

    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT} [${process.env.NODE_ENV}]`)
    })
  } catch (err) {
    console.error('✗ Failed to start server:', err.message)
    process.exit(1)
  }
}

start()