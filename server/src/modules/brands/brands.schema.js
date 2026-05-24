import { z } from 'zod'

export const createBrandSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().optional(),
  logo_url: z.string().url('Invalid URL').optional(),
  category: z.string().max(100).optional(),
})

export const updateBrandSchema = createBrandSchema.partial()

export const createChainSchema = z.object({
  brand_id: z.string().uuid('Invalid brand ID'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  region: z.string().max(100).optional(),
  manager_id: z.string().uuid('Invalid manager ID').optional(),
})

export const updateChainSchema = createChainSchema.partial()