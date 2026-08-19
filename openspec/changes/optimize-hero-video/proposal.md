# Propuesta: optimizar el video del hero

## Propósito

Reducir el peso y el tiempo de carga del video de fondo sin cambiar su duración ni su función visual.

## Alcance

- Generar variantes locales de 720p y 1080p.
- Codificar las variantes como MP4 H.264 ampliamente compatible.
- Eliminar el audio de todas las variantes.
- Agregar un poster local para la carga inicial.
- Seleccionar la resolución según el ancho de pantalla.

## Criterios de éxito

- El hero deja de depender del archivo remoto de 31.3 MB.
- Las variantes pesan menos de 10 MB cada una.
- Cada variante conserva 30 segundos de duración y 30 FPS.
- El navegador dispone de una fuente compatible en escritorio y móvil.
- El video mantiene reproducción automática, silenciosa y en bucle.
