import { Router } from 'express'
import {
  getAllFoodCourts,
  getFoodCourt,
  createFoodCourt,
  updateFoodCourt,
  deleteFoodCourt,
  getAllStalls,
  createStall,
  updateStall,
  deleteStall,
} from './foodcourt.controller.js'
import auth from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import validate from '../../middleware/validate.js'
import {
  createFoodCourtSchema,
  updateFoodCourtSchema,
  createStallSchema,
  updateStallSchema,
} from './foodcourt.schema.js'

const router = Router()

router.use(auth)

router.get('/', getAllFoodCourts)
router.get('/:id', getFoodCourt)
router.post('/', requireRole('admin'), validate(createFoodCourtSchema), createFoodCourt)
router.patch('/:id', requireRole('manager'), validate(updateFoodCourtSchema), updateFoodCourt)
router.delete('/:id', requireRole('admin'), deleteFoodCourt)

router.get('/:id/stalls', getAllStalls)
router.post('/:id/stalls', requireRole('admin'), validate(createStallSchema), createStall)
router.patch('/:id/stalls/:stallId', requireRole('manager'), validate(updateStallSchema), updateStall)
router.delete('/:id/stalls/:stallId', requireRole('admin'), deleteStall)

export default router