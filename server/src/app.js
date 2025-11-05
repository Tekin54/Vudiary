import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import debug from 'debug';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import eintragRoute from './api/routes/eintragsRoutes.js';
import sql from '../boilerplate/db/index.js'; // unbedingt importieren!

dotenv.config();
debug.enable(process.env.DEBUG);

const startup = debug('startup');
const dirname = path.resolve();

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(dirname, '/public')));

// TEST-DB ENDPOINT → hier einfügen
app.get('/testdb', async (req, res) => {
  try {
    const result = await sql`SELECT NOW()`;
    res.json(result);
  } catch (err) {
    console.error('DB-Verbindungsfehler:', err);
    res.status(500).send('DB-Verbindungsfehler');
  }
});

// Deine eigentlichen Routen
app.use('/eintraege', eintragRoute);

// Fehler-Handler
app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => startup(`Server is running on port ${PORT}`));

export default app;
