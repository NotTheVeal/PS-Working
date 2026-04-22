import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import routes from './routes';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'ps-working-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 8 * 60 * 60 * 1000 },
  }),
);

app.use('/api', routes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`PartsSource AI backend running on http://localhost:${PORT}`);
});
