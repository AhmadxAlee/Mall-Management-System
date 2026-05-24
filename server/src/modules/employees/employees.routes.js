import { Router } from 'express'
import {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from './employees.controller.js'
import auth from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import validate from '../../middleware/validate.js'
import { createEmployeeSchema, updateEmployeeSchema } from './employees.schema.js'

const router = Router()

router.use(auth)

router.get('/', requireRole('manager'), getAllEmployees)
router.get('/:id', requireRole('manager'), getEmployee)
router.post('/', requireRole('admin'), validate(createEmployeeSchema), createEmployee)
router.patch('/:id', requireRole('manager'), validate(updateEmployeeSchema), updateEmployee)
router.delete('/:id', requireRole('admin'), deleteEmployee)

export default router