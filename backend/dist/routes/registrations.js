import { Router } from 'express';
import { prisma } from '../config/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
const router = Router();
router.post('/:eventId', requireAuth, async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.user.id;
    const event = await prisma.event.findUnique({ where: { id: eventId }, include: { _count: { select: { registrations: true } } } });
    if (!event)
        return res.status(404).json({ error: 'Event not found' });
    const overlap = await prisma.registration.findFirst({
        where: {
            userId,
            event: {
                startTime: { lte: event.endTime },
                endTime: { gte: event.startTime }
            }
        }
    });
    if (overlap)
        return res.status(409).json({ error: 'Schedule conflict' });
    const status = event._count.registrations >= event.capacity ? 'WAITLIST' : 'CONFIRMED';
    const reg = await prisma.registration.create({
        data: { userId, eventId, qrCode: `QR-${eventId}-${userId}`, status: status }
    });
    await prisma.analytics.update({ where: { eventId }, data: { registrationsCount: { increment: status === 'CONFIRMED' ? 1 : 0 }, revenue: { increment: event.price } } }).catch(() => { });
    res.status(201).json(reg);
});
router.get('/mine', requireAuth, async (req, res) => {
    const regs = await prisma.registration.findMany({ where: { userId: req.user.id }, include: { event: true } });
    res.json(regs);
});
router.post('/validate', requireAuth, requireRole('ORGANIZER', 'ADMIN'), async (req, res) => {
    const { qr } = req.body;
    const reg = await prisma.registration.findFirst({ where: { qrCode: qr }, include: { user: true, event: true } });
    if (!reg)
        return res.status(404).json({ valid: false });
    res.json({ valid: true, registration: reg });
});
router.get('/export/:eventId.csv', requireAuth, requireRole('ORGANIZER', 'ADMIN'), async (req, res) => {
    const eventId = req.params.eventId;
    const regs = await prisma.registration.findMany({ where: { eventId }, include: { user: true } });
    const header = 'name,email,status,qr\n';
    const rows = regs.map(r => `${r.user.name},${r.user.email},${r.status},${r.qrCode}`).join('\n');
    const csv = header + rows;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=event-${eventId}-attendees.csv`);
    res.send(csv);
});
export default router;
