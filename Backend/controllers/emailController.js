const { gmail, loadTokens } = require('./authController');
const fs = require('fs').promises;
const path = require('path');

// Función auxiliar para decodificar el cuerpo del correo
function decodeEmailBody(part) {
  if (!part) return '';
  
  if (part.body && part.body.data) {
    return Buffer.from(part.body.data, 'base64').toString('utf-8');
  }
  
  if (part.parts) {
    return part.parts.map(p => decodeEmailBody(p)).join('\n');
  }
  
  return '';
}

// Función auxiliar para obtener el tipo de contenido
function getContentType(part) {
  if (!part) return '';
  
  if (part.mimeType) {
    return part.mimeType;
  }
  
  if (part.parts) {
    return part.parts.map(p => getContentType(p)).join(', ');
  }
  
  return '';
}

// Obtener lista de correos
const getEmails = async () => {
  try {
    await loadTokens();
    
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 100,
      q: 'in:inbox'
    });

    const messages = response.data.messages || [];
    const emailDetails = [];

    for (const message of messages) {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id
      });

      const headers = email.data.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || 'Sin asunto';
      const from = headers.find(h => h.name === 'From')?.value || 'Desconocido';
      const date = headers.find(h => h.name === 'Date')?.value || 'Sin fecha';
      const to = headers.find(h => h.name === 'To')?.value || '';

      // Obtener el cuerpo del correo
      const body = decodeEmailBody(email.data.payload);
      const contentType = getContentType(email.data.payload);

      // Extraer adjuntos
      const attachments = [];
      function extractAttachments(parts) {
        if (!parts) return;
        
        for (const part of parts) {
          if (part.filename && part.body && part.body.attachmentId) {
            attachments.push({
              filename: part.filename,
              mimeType: part.mimeType,
              size: part.body.size,
              attachmentId: part.body.attachmentId
            });
          }
          
          if (part.parts) {
            extractAttachments(part.parts);
          }
        }
      }

      extractAttachments([email.data.payload]);

      emailDetails.push({
        id: message.id,
        subject,
        from,
        to,
        date,
        body,
        contentType,
        hasAttachments: attachments.length > 0,
        attachments,
        snippet: email.data.snippet || ''
      });
    }

    // Ordenar correos por fecha, más recientes primero
    emailDetails.sort((a, b) => new Date(b.date) - new Date(a.date));

    return emailDetails;
  } catch (error) {
    console.error('Error obteniendo correos:', error);
    throw new Error('Error obteniendo correos');
  }
};

// Obtener detalles de un correo específico
const getEmailDetails = async (messageId) => {
  try {
    await loadTokens();
    
    const email = await gmail.users.messages.get({
      userId: 'me',
      id: messageId
    });

    const headers = email.data.payload.headers;
    const subject = headers.find(h => h.name === 'Subject')?.value || 'Sin asunto';
    const from = headers.find(h => h.name === 'From')?.value || 'Desconocido';
    const date = headers.find(h => h.name === 'Date')?.value || 'Sin fecha';
    const to = headers.find(h => h.name === 'To')?.value || '';

    // Obtener el cuerpo del correo
    const body = decodeEmailBody(email.data.payload);
    const contentType = getContentType(email.data.payload);

    const attachments = [];
    
    function extractAttachments(parts) {
      if (!parts) return;
      
      for (const part of parts) {
        if (part.filename && part.body && part.body.attachmentId) {
          attachments.push({
            filename: part.filename,
            mimeType: part.mimeType,
            size: part.body.size,
            attachmentId: part.body.attachmentId
          });
        }
        
        if (part.parts) {
          extractAttachments(part.parts);
        }
      }
    }

    extractAttachments([email.data.payload]);

    return {
      id: messageId,
      subject,
      from,
      to,
      date,
      body,
      contentType,
      attachments
    };
  } catch (error) {
    console.error('Error obteniendo detalles del correo:', error);
    throw new Error('Error obteniendo detalles del correo');
  }
};

// Descargar un adjunto específico
const downloadAttachment = async (messageId, attachmentId, filename) => {
  try {
    await loadTokens();
    
    const attachment = await gmail.users.messages.attachments.get({
      userId: 'me',
      messageId: messageId,
      id: attachmentId
    });

    const data = Buffer.from(attachment.data.data, 'base64');
    
    // Crear directorio downloads si no existe
    const downloadDir = path.join(__dirname, '..', 'downloads');
    try {
      await fs.access(downloadDir);
    } catch {
      await fs.mkdir(downloadDir);
    }

    // Guardar archivo
    const filePath = path.join(downloadDir, filename);
    await fs.writeFile(filePath, data);

    return {
      filePath,
      filename
    };
  } catch (error) {
    console.error('Error descargando adjunto:', error);
    throw new Error('Error descargando adjunto');
  }
};

// Descargar todos los adjuntos de un correo
const downloadAllAttachments = async (messageId) => {
  try {
    await loadTokens();
    
    const email = await gmail.users.messages.get({
      userId: 'me',
      id: messageId
    });

    const attachments = [];
    
    function extractAttachments(parts) {
      if (!parts) return;
      
      for (const part of parts) {
        if (part.filename && part.body && part.body.attachmentId) {
          attachments.push({
            filename: part.filename,
            attachmentId: part.body.attachmentId
          });
        }
        
        if (part.parts) {
          extractAttachments(part.parts);
        }
      }
    }

    extractAttachments([email.data.payload]);

    const downloadedFiles = [];

    for (const att of attachments) {
      const attachment = await gmail.users.messages.attachments.get({
        userId: 'me',
        messageId: messageId,
        id: att.attachmentId
      });

      const data = Buffer.from(attachment.data.data, 'base64');
      
      const downloadDir = path.join(__dirname, '..', 'downloads');
      try {
        await fs.access(downloadDir);
      } catch {
        await fs.mkdir(downloadDir);
      }

      const filePath = path.join(downloadDir, att.filename);
      await fs.writeFile(filePath, data);
      
      downloadedFiles.push({
        filename: att.filename,
        path: filePath,
        size: data.length
      });
    }

    return downloadedFiles;
  } catch (error) {
    console.error('Error descargando adjuntos:', error);
    throw new Error('Error descargando adjuntos');
  }
};

module.exports = {
  getEmails,
  getEmailDetails,
  downloadAttachment,
  downloadAllAttachments
}; 