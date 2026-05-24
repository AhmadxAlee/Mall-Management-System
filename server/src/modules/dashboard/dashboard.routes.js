import { Router } from 'express'
import { getStats, getRecentActivity, getInventoryOverview } from './dashboard.controller.js'
import { getAISummary } from './ai.controller.js'
import auth from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'

const router = Router()

router.use(auth)

router.get('/stats', requireRole('manager'), getStats)
router.get('/recent-activity', requireRole('manager'), getRecentActivity)
router.get('/inventory-overview', requireRole('manager'), getInventoryOverview)
router.get('/ai-summary', requireRole('manager'), getAISummary)

export default router