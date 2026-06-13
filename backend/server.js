require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');
const { createAdminIfNotExists } = require('./models');

const app = express();

// ----- Configuration CORS (ouverte pour diagnostic) -----
// Permet à n’importe quelle origine d’appeler l’API (temporaire)
const corsOptions = {
    origin: '*',
    credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
// -------------------------------------------------------

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/gl', require('./routes/gl'));
app.use('/api/depenses', require('./routes/depenses'));
app.use('/api/membres', require('./routes/membres'));
app.use('/api/months', require('./routes/months'));
app.use('/api/config', require('./routes/config'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/frais', require('./routes/frais'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/users', require('./routes/users'));
app.use('/api/eglises', require('./routes/eglises'));

const start = async () => {
  await initDb();               
  await createAdminIfNotExists();
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`✅ Backend démarré sur le port ${port}`);
  });
};

start();
