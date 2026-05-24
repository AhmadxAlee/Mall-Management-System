import { z } from 'zod'

export const createOutletSchema = z.object({
  brand_id: z.string().uuid('Invalid brand ID'),
  chain_id: z.string().uuid('Invalid chain ID').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  floor: z.string().max(50).optional(),
  shop_number: z.string().max(50).optional(),
  contact_number: z.string().max(20).optional(),
  manager_id: z.string().uuid('Invalid manager ID').optional(),
})

export const updateOutletSchema = createOutletSchema.partial()