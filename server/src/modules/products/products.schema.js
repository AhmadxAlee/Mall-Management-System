import { z } from 'zod'

export const createProductSchema = z.object({
  outlet_id: z.string().uuid('Invalid outlet ID').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().optional(),
  price: z.number().positive('Price must be a positive number'),
  category: z.string().max(100).optional(),
  sku: z.string().max(100).optional(),
  quantity: z.number().int().min(0).default(0),
  min_stock_level: z.number().int().min(0).default(10),
})

export const updateProductSchema = createProductSchema.partial()

export const updateInventorySchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  min_stock_level: z.number().int().min(0).optional(),
})