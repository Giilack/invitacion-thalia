# Invitación de 17 años — THALIA

Landing page rosa y glamorosa para los 17 años de Thalia.

## Incluye
- Diseño responsive para celular y PC.
- Cuenta regresiva hasta el 05/09/2026 a las 7:30 PM.
- Fecha, hora y dirección.
- Botón de GPS con Google Maps.
- Formulario de confirmación de asistencia.
- Registro de nombre, apellido y asistencia.
- Base de datos Supabase.
- Botón para compartir la invitación.
- Preparada para publicarse con Vercel, Netlify o GitHub Pages.

## Configurar la base de datos

1. Crea una cuenta/proyecto en Supabase.
2. Abre SQL Editor.
3. Ejecuta el contenido de `supabase.sql`.
4. Ve a Project Settings > API.
5. Copia:
   - Project URL
   - anon public key
6. Abre `config.js` y reemplaza:
   `PEGA_AQUI_TU_SUPABASE_URL`
   `PEGA_AQUI_TU_SUPABASE_ANON_KEY`

## Publicar gratis

### Opción recomendada: Vercel
1. Crea una cuenta en Vercel.
2. Sube esta carpeta a un repositorio de GitHub.
3. En Vercel selecciona "Add New Project".
4. Importa el repositorio.
5. Framework: Other / proyecto estático.
6. Deploy.
7. Vercel te dará una dirección pública, por ejemplo:
   https://tu-invitacion.vercel.app

Ese es el enlace que puedes enviar por WhatsApp.

### Alternativa: Netlify
Puedes arrastrar la carpeta del proyecto a Netlify Drop y obtener una URL pública.

## Seguridad
La clave `anon public` de Supabase está diseñada para usarse en el frontend. La seguridad real de los registros se controla mediante Row Level Security (RLS), configurada en `supabase.sql`.
