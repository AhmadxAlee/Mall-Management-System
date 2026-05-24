import { Router } from 'express'
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
} from './products.controller.js'
import auth from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import validate from '../../middleware/validate.js'
import { createProductSchema, updateProductSchema } from './products.schema.js'

const router = Router()

router.use(auth)

router.get('/', getAllProducts)
router.get('/low-stock', getLowStockProducts)
router.get('/:id', getProduct)
router.post('/', requireRole('manager'), validate(createProductSchema), createProduct)
router.patch('/:id', requireRole('manager'), validate(updateProductSchema), updateProduct)
router.delete('/:id', requireRole('admin'), deleteProduct)

export default router