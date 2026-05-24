import OpenAI from 'openai'
import { query } from '../../config/db.js'
import catchAsync from '../../utils/catchAsync.js'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const getAISummary = catchAsync(async (req, res) => {
  const [employees, brands, outlets, foodCourts, products, lowStock, inventory] = await Promise.all([
    query(`SELECT COUNT(*) FROM employees WHERE is_active = true`),
    query(`SELECT COUNT(*) FROM brands WHERE is_active = true`),
    query(`SELECT COUNT(*) FROM outlets WHERE is_active = true`),
    query(`SELECT COUNT(*) FROM food_courts WHERE is_active = true`),
    query(`SELECT COUNT(*) FROM products WHERE is_active = true`),
    query(`SELECT COUNT(*) FROM products p
           LEFT JOIN inventory i ON i.product_id = p.id
           WHERE p.is_active = true AND i.quantity <= i.min_stock_level`),
    query(`SELECT SUM(i.quantity) as total_stock,
           COUNT(CASE WHEN i.quantity = 0 THEN 1 END) as out_of_stock
           FROM inventory i
           JOIN products p ON p.id = i.product_id
           WHERE p.is_active = true`),
  ])

  const stats = {
    totalEmployees: parseInt(employees.rows[0].count),
    totalBrands: parseInt(brands.rows[0].count),
    totalOutlets: parseInt(outlets.rows[0].count),
    totalFoodCourts: parseInt(foodCourts.rows[0].count),
    totalProducts: parseInt(products.rows[0].count),
    lowStockProducts: parseInt(lowStock.rows[0].count),
    totalStock: parseInt(inventory.rows[0].total_stock) || 0,
    outOfStock: parseInt(inventory.rows[0].out_of_stock) || 0,
  }

  const prompt = `You are a mall management analyst. Based on the following mall data, provide a concise 3-4 sentence business insight and recommendations. Be specific and actionable.

Mall Data:
- Total Employees: ${stats.totalEmployees}
- Total Brands: ${stats.totalBrands}
- Total Outlets: ${stats.totalOutlets}
- Food Courts: ${stats.totalFoodCourts}
- Total Products: ${stats.totalProducts}
- Low Stock Products: ${stats.lowStockProducts}
- Total Stock Units: ${stats.totalStock}
- Out of Stock Products: ${stats.outOfStock}

Provide insights about staffing, inventory health, and operational recommendations.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
    temperature: 0.7,
  })

  const summary = completion.choices[0].message.content

  res.status(200).json({
    status: 'success',
    data: { summary, stats },
  })
})