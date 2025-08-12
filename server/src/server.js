import express from 'express';
import 'dotenv/config';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/ratelimiter.js';

import transactions from './routes/transactions.route.js';

const app = express();
const PORT = process.env.PORT;

app.use(rateLimiter);
app.use(express.json());

app.use('/api/transactions', transactions);

initDB().then(() => {
  app.listen(PORT, () =>
    console.log(`server running on http://localhost:${PORT}`)
  );
});
