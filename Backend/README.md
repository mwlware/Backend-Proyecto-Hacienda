# Gmail Attachment Downloader

Proyecto con Node.js y Express para analizar correos de Gmail y descargar adjuntos.

## Configuración Inicial

### 1. Crear proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la Gmail API:
   - Ve a "APIs y servicios" → "Biblioteca"
   - Busca "Gmail API" y habilítala

### 2. Configurar OAuth 2.0

1. Ve a "APIs y servicios" → "Credenciales"
2. Haz clic en "Crear credenciales" → "ID de cliente de OAuth 2.0"
3. Selecciona "Aplicación web"
4. Agrega estas URIs de redirección:
   - `http://localhost:3000/oauth2callback`
5. Guarda el Client ID y Client Secret

### 3. Configurar variables de entorno

Copia el archivo `.env` y completa con tus credenciales:

```env
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_client_secret_de_google
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth2callback
PORT=3000
```

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## Uso

1. **Iniciar servidor**: `npm start`
2. **Abrir navegador**: `http://localhost:3000`
3. **Autenticar**: Hacer clic en "Autenticar con Google"
4. **Ver correos**: Navegar a `/emails` para ver correos con adjuntos
5. **Descargar adjuntos**: Usar las rutas de descarga

## Endpoints API

### GET /
Página principal con enlaces de navegación

### GET /auth
Inicia el proceso de autenticación OAuth2

### GET /oauth2callback
Callback para completar la autenticación

### GET /emails
Obtiene lista de correos con adjuntos (máximo 10)

```json
[
  {
    "id": "mensaje_id",
    "subject": "Asunto del correo",
    "from": "remitente@email.com",
    "date": "fecha",
    "hasAttachments": true
  }
]
```

### GET /email/:id
Obtiene detalles de un correo específico y sus adjuntos

```json
{
  "id": "mensaje_id",
  "attachments": [
    {
      "filename": "documento.pdf",
      "mimeType": "application/pdf",
      "size": 12345,
      "attachmentId": "adjunto_id"
    }
  ]
}
```

### GET /download/:messageId/:attachmentId/:filename
Descarga un adjunto específico

### GET /download-all/:messageId
Descarga todos los adjuntos de un correo

```json
{
  "message": "Adjuntos descargados exitosamente",
  "files": [
    {
      "filename": "documento.pdf",
      "path": "/ruta/completa/documento.pdf",
      "size": 12345
    }
  ]
}
```

## Estructura del proyecto

```
gmail-attachment-downloader/
├── server.js           # Servidor principal
├── package.json        # Dependencias y scripts
├── .env               # Variables de entorno
├── tokens.json        # Tokens OAuth (generado automáticamente)
├── downloads/         # Carpeta para adjuntos descargados
└── README.md          # Este archivo
```

## Características

- **Autenticación OAuth2** con Gmail
- **Lista correos** con adjuntos
- **Analiza contenido** de correos
- **Descarga adjuntos** individuales o todos
- **API REST** completa
- **Manejo de errores** robusto

## Notas de Seguridad

- Los tokens se guardan en `tokens.json` (para desarrollo)
- En producción, usa una base de datos segura
- Nunca subas el archivo `.env` al repositorio
- Configura HTTPS en producción

## Posibles Mejoras

- Interface web más completa
- Base de datos para tokens
- Filtros avanzados de búsqueda
- Compresión de archivos descargados
- Límites de descarga por usuario
- Logs de actividad