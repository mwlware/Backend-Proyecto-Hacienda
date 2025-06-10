========================================
GUÍA RÁPIDA PARA SUBIR CAMBIOS A GITHUB
========================================

1. VERIFICA LA RUTA DONDE ESTÁS TRABAJANDO

- Ruta del Frontend:
  E:\Hacienda_bogotá\frontend>

- Ruta del Backend:
  E:\Hacienda_bogotá\backend>

----------------------------------------

2. INICIAR LOS SERVIDORES LOCALMENTE

Desde la carpeta correspondiente (frontend o backend), ejecutar:

> npm run dev

Este comando levanta el servidor local en modo desarrollo.

----------------------------------------

3. COMANDOS PARA SUBIR CAMBIOS A LA RAMA `main`

Paso 1: Agrega los cambios
> git add .

Paso 2: Haz commit con un mensaje claro
> git commit -m "descripción del cambio"

Paso 3: Sube los cambios al repositorio
> git push origin main

----------------------------------------

4. NOTAS IMPORTANTES

- NO usar `git push -f` (forzar) a menos que lo indique el líder del equipo.
- Usa mensajes de commit claros y específicos.
- Si tienes dudas, consulta antes de subir.

¡Gracias por mantener el proyecto limpio y ordenado!
