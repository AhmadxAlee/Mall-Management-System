import { Router } from 'express'
import {
  getAllBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  getChainsByBrand,
  createChain,
  updateChain,
  deleteChain,
} from './brands.controller.js'
import auth from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import validate from '../../middleware/validate.js'
import {
  createBrandSchema,
  updateBrandSchema,
  createChainSchema,
  updateChainSchema,
} from './brands.schema.js'

const router = Router()

router.use(auth)

router.get('/', getAllBrands)
router.get('/:id', getBrand)
router.post('/', requireRole('admin'), validate(createBrandSchema), createBrand)
router.patch('/:id', requireRole('manager'), validate(updateBrandSchema), updateBrand)
router.delete('/:id', requireRole('admin'), deleteBrand)

router.get('/:id/chains', getChainsByBrand)
router.post('/:id/chains', requireRole('admin'), validate(createChainSchema), createChain)
router.patch('/:id/chains/:chainId', requireRole('manager'), validate(updateChainSchema), updateChain)
router.delete('/:id/chains/:chainId', requireRole('admin'), deleteChain)

export default router