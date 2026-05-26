import { query } from '../../config/db.js'
import catchAsync from '../../utils/catchAsync.js'

export const getStats = catchAsync(async (req, res) => {
  const [
    employeesResult,
    brandsResult,
    outletsResult,
    foodCourtsResult,
    productsResult,
    lowStockResult,
  ] = await Promise.all([
    query(`SELECT COUNT(*) FROM employees WHERE is_active = true`),
    query(`SELECT COUNT(*) FROM brands WHERE is_active = true`),
    query(`SELECT COUNT(*) FROM outlets WHERE is_active = true`),
    query(`SELECT COUNT(*) FROM food_courts WHERE is_active = true`),
    query(`SELECT COUNT(*) FROM products WHERE is_active = true`),
    query(`SELECT COUNT(*) FROM products p
           LEFT JOIN inventory i ON i.product_id = p.id
           WHERE p.is_active = true AND i.quantity <= i.min_stock_level`),
  ])

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalEmployees: parseInt(employeesResult.rows[0].count),
        totalBrands: parseInt(brandsResult.rows[0].count),
        totalOutlets: parseInt(outletsResult.rows[0].count),
        totalFoodCourts: parseInt(foodCourtsResult.rows[0].count),
        totalProducts: parseInt(productsResult.rows[0].count),
        lowStockProducts: parseInt(lowStockResult.rows[0].count),
      },
    },
  })
})

export const getRecentActivity = catchAsync(async (req, res) => {
  const [recentEmployees, recentProducts, recentOutlets] = await Promise.all([
    query(
      `SELECT id, name, role, department, created_at FROM employees
       WHERE is_active = true ORDER BY created_at DESC LIMIT 5`
    ),
    query(
      `SELECT p.id, p.name, p.price, p.category, i.quantity, p.created_at
       FROM products p
       LEFT JOIN inventory i ON i.product_id = p.id
       WHERE p.is_active = true ORDER BY p.created_at DESC LIMIT 5`
    ),
    query(
      `SELECT o.id, o.name, o.floor, o.shop_number, b.name as brand_name, o.created_at
       FROM outlets o
       LEFT JOIN brands b ON b.id = o.brand_id
       WHERE o.is_active = true ORDER BY o.created_at DESC LIMIT 5`
    ),
  ])

  res.status(200).json({
    status: 'success',
    data: {
      recentEmployees: recentEmployees.rows,
      recentProducts: recentProducts.rows,
      recentOutlets: recentOutlets.rows,
    },
  })
})

export const getInventoryOverview = catchAsync(async (req, res) => {
  const { rows } = await query(
    `SELECT 
      SUM(i.quantity) as total_stock,
      COUNT(CASE WHEN i.quantity = 0 THEN 1 END) as out_of_stock,
      COUNT(CASE WHEN i.quantity <= i.min_stock_level AND i.quantity > 0 THEN 1 END) as low_stock,
      COUNT(CASE WHEN i.quantity > i.min_stock_level THEN 1 END) as in_stock
     FROM inventory i
     JOIN products p ON p.id = i.product_id
     WHERE p.is_active = true`
  )

  res.status(200).json({
    status: 'success',
    data: { inventory: rows[0] },
  })
})

export const getEmployeeStats = catchAsync(async (req, res) => {
  const { rows } = await query(
    `SELECT 
      COALESCE(department, 'Unassigned') as department,
      COUNT(*) as count,
      role
     FROM employees
     WHERE is_active = true
     GROUP BY department, role
     ORDER BY count DESC`
  )

  res.status(200).json({
    status: 'success',
    data: { employeeStats: rows },
  })
})