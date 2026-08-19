# Diseño técnico

## Arquitectura

El prototipo usa HTML, CSS y JavaScript sin herramientas de compilación. El hero contiene cuatro capas:

1. Video de fondo.
2. Visor de Spline.
3. Degradado de contraste.
4. Contenido y controles.

## Integración de Spline

Se usa el componente web `@splinetool/viewer` porque el sitio productivo no es una aplicación de Next.js. La escena recibe eventos globales para mantener su interacción de desplazamiento aun cuando el lienzo no capture clics.

## Control del desplazamiento

Al iniciar, el documento bloquea el desplazamiento si Spline está disponible. El primer gesto hacia abajo marca el hero como revelado y libera el documento después de una pausa breve. Al volver al inicio, el prototipo restablece el estado.

También se incluye un botón visible y activable con teclado para no depender exclusivamente de un gesto.

## Rendimiento y accesibilidad

- El video tiene dimensiones reservadas mediante el hero de altura completa.
- El visor se desactiva cuando el usuario solicita movimiento reducido.
- El botón de avance mantiene un área táctil mínima de 48 px.
- El contenido usa contraste reforzado y etiquetas visibles.
- El modo de respaldo deja el video disponible cuando la escena no carga.

## Dependencia pendiente

La escena publicada contiene objetos opacos. Para revelar realmente el video, el archivo de Spline debe republicarse con `Backdrop` oculto y materiales transparentes en el estado de desplazamiento.
