import { z } from 'zod'

export const createFoodCourtSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  floor: z.string().max(50).optional(),
  total_stalls: z.number().int().positive().optional(),
})

export const updateFoodCourtSchema = createFoodCourtSchema.partial()

export const createStallSchema = z.object({
  food_court_id: z.string().uuid('Invalid food court ID'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  cuisine_type: z.string().max(100).optional(),
  contact_number: z.string().max(20).optional(),
  manager_id: z.string().uuid('Invalid manager ID').optional(),
})

export const updateStallSchema = createStallSchema.partial()