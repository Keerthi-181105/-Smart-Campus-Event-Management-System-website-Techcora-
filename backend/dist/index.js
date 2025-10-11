import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import regRoutes from './routes/registrations';
import analyticsRoutes from './routes/analytics';
import notesRoutes from './routes/notifications';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.CORS_ORIGINS?.split(',').map(o => o.trim()) || '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
});
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(',').map(o => o.trim()) || '*' }));
app.use(express.json());
app.use(morgan('dev'));
const specPath = path.join(process.cwd(), 'docs', 'openapi.yaml');
if (fs.existsSync(specPath)) {
    const file = fs.readFileSync(specPath, 'utf8');
    const spec = YAML.parse(file);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
}
io.on('connection', socket => {
    socket.emit('connected', { ok: true });
});
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', regRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notesRoutes);
const port = Number(process.env.PORT || 4000);
server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${port}`);
});
