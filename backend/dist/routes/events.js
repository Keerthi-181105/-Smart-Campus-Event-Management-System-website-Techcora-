import { Router } from 'express';
import { prisma } from '../config/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
const router = Router();
router.get('/', async (req, res) => {
    const { q, category } = req.query;
    const events = await prisma.event.findMany({
        where: {
            AND: [
                q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }, { venue: { contains: q, mode: 'insensitive' } }] } : {},
                category ? { category } : {}
            ]
        },
        include: {
            _count: { select: { registrations: true } },
            analytics: true
        },
        orderBy: { startTime: 'asc' }
    });
    res.json(events);
});
router.get('/:id', async (req, res) => {
    const event = await prisma.event.findUnique({ where: { id: req.params.id }, include: { _count: { select: { registrations: true } }, analytics: true } });
    if (!event)
        return res.status(404).json({ error: 'Not found' });
    res.json(event);
});
router.post('/', requireAuth, requireRole('ORGANIZER', 'ADMIN'), async (req, res) => {
    const data = req.body;
    const event = await prisma.event.create({ data: { ...data, organizerId: req.user.id, analytics: { create: {} } } });
    res.status(201).json(event);
});
router.put('/:id', requireAuth, requireRole('ORGANIZER', 'ADMIN'), async (req, res) => {
    const event = await prisma.event.update({ where: { id: req.params.id }, data: req.body });
    res.json(event);
});
router.delete('/:id', requireAuth, requireRole('ORGANIZER', 'ADMIN'), async (req, res) => {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.status(204).end();
});
export default router;
