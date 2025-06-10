const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const emailRoutes = require('./routes/emailRoutes');

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Usar rutas
app.use('/api', authRoutes);
app.use('/api', emailRoutes);

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

module.exports = app;