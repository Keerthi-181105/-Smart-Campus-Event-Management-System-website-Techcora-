import { Router } from 'express'
import { prisma } from '../config/prisma'
import { requireAuth, requireRole } from '../middleware/auth'

const router = Router()

router.get('/events/:eventId', requireAuth, requireRole('ORGANIZER', 'ADMIN'), async (req, res) => {
  // eslint-disable-next-line no-console
  console.log('[analytics] fetch event analytics', { eventId: req.params.eventId })
  const analytics = await prisma.analytics.findUnique({ where: { eventId: req.params.eventId } })
  res.json(analytics)
})

router.get('/overview', requireAuth, requireRole('ADMIN'), async (_req, res) => {
  // eslint-disable-next-line no-console
  console.log('[analytics] fetch overview')
  const [events, users, regs] = await Promise.all([
    prisma.event.count(),
    prisma.user.count(),
    prisma.registration.count()
  ])
  res.json({ events, users, registrations: regs })
})

export default router



