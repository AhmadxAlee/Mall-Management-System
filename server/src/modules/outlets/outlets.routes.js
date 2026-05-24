import { Router } from 'express'
import {
  getAllOutlets,
  getOutlet,
  createOutlet,
  updateOutlet,
  deleteOutlet,
} from './outlets.controller.js'
import auth from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import validate from '../../middleware/validate.js'
import { createOutletSchema, updateOutletSchema } from './outlets.schema.js'

const router = Router()

router.use(auth)

router.get('/', getAllOutlets)
router.get('/:id', getOutlet)
router.post('/', requireRole('admin'), validate(createOutletSchema), createOutlet)
router.patch('/:id', requireRole('manager'), validate(updateOutletSchema), updateOutlet)
router.delete('/:id', requireRole('admin'), deleteOutlet)

export default router