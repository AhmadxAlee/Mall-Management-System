import { z } from 'zod'

export const createEmployeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20).optional(),
  role: z.enum(['admin', 'manager', 'employee']).default('employee'),
  department: z.string().max(100).optional(),
  salary: z.number().positive('Salary must be a positive number').optional(),
  hire_date: z.string().optional(),
})

export const updateEmployeeSchema = createEmployeeSchema.partial()