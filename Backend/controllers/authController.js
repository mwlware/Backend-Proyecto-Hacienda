const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

// Configuración OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Configurar Gmail API
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// Cargar tokens guardados
async function loadTokens() {
  try {
    const tokens = await fs.readFile('tokens.json', 'utf8');
    oauth2Client.setCredentials(JSON.parse(tokens));
    return true;
  } catch (error) {
    return false;
  }
}

// Generar URL de autenticación
const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly']
  });
};

// Manejar callback de OAuth
const handleCallback = async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Guardar tokens (en producción, usar base de datos)
    await fs.writeFile('tokens.json', JSON.stringify(tokens));
    
    return { success: true };
  } catch (error) {
    console.error('Error en autenticación:', error);
    throw new Error('Error de autenticación');
  }
};

module.exports = {
  oauth2Client,
  gmail,
  loadTokens,
  getAuthUrl,
  handleCallback
}; 