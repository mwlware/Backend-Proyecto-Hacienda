const express = require('express');
const router = express.Router();
const { getAuthUrl, handleCallback } = require('../controllers/authController');

// Ruta de autenticación
router.get('/auth', (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

// Callback de OAuth
router.get('/oauth2callback', async (req, res) => {
  try {
    const code = req.query.code;
    await handleCallback(code);
    res.redirect('/emails');
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).send('Error de autenticación');
  }
});

module.exports = router; 