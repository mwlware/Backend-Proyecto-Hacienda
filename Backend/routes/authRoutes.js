const express = require('express');
const router = express.Router();
const { getAuthUrl, handleCallback } = require('../controllers/authController');

// Ruta para iniciar el proceso de autenticación
router.get('/auth', (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

// Ruta de callback para OAuth
router.get('/auth/callback', async (req, res) => {
  try {
    const { code } = req.query;
    await handleCallback(code);
    res.redirect('http://localhost:5173/');
  } catch (error) {
    console.error('Error en callback:', error);
    res.status(500).send('Error en autenticación');
  }
});

module.exports = router; 