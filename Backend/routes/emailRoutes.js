const express = require('express');
const router = express.Router();
const { 
  getEmails, 
  getEmailDetails, 
  downloadAttachment, 
  downloadAllAttachments 
} = require('../controllers/emailController');
const { requireAuth } = require('../middleware/authMiddleware');

// Aplicar middleware de autenticación a todas las rutas de email
router.use(requireAuth);

// Obtener lista de correos
router.get('/emails', async (req, res) => {
  try {
    const emails = await getEmails();
    res.json(emails);
  } catch (error) {
    console.error('Error obteniendo correos:', error);
    res.status(500).json({ error: 'Error obteniendo correos' });
  }
});

// Obtener detalles específicos de un correo
router.get('/email/:id', async (req, res) => {
  try {
    const emailDetails = await getEmailDetails(req.params.id);
    res.json(emailDetails);
  } catch (error) {
    console.error('Error obteniendo detalles del correo:', error);
    res.status(500).json({ error: 'Error obteniendo detalles del correo' });
  }
});

// Descargar adjunto específico
router.get('/download/:messageId/:attachmentId/:filename', async (req, res) => {
  try {
    const { messageId, attachmentId, filename } = req.params;
    const { filePath } = await downloadAttachment(messageId, attachmentId, filename);
    res.download(filePath, filename);
  } catch (error) {
    console.error('Error descargando adjunto:', error);
    res.status(500).json({ error: 'Error descargando adjunto' });
  }
});

// Descargar todos los adjuntos de un correo
router.get('/download-all/:messageId', async (req, res) => {
  try {
    const downloadedFiles = await downloadAllAttachments(req.params.messageId);
    res.json({
      message: 'Adjuntos descargados exitosamente',
      files: downloadedFiles
    });
  } catch (error) {
    console.error('Error descargando adjuntos:', error);
    res.status(500).json({ error: 'Error descargando adjuntos' });
  }
});

module.exports = router; 