# MandalaTickets — prototipo de hero con Spline

Prototipo local del hero de `mandalatickets.com` con el video actual debajo de una escena interactiva de Spline.

## Ejecutar

La página no requiere compilación. Debido a que usa módulos y recursos remotos, conviene servirla por HTTP:

```powershell
python -m http.server 4173
```

Después abre `http://localhost:4173`.

## Capas del hero

1. `.hero__video`: video remoto del sitio actual.
2. `.hero__spline`: escena 3D publicada.
3. `.hero__shade`: degradado para conservar contraste.
4. `.hero__content`: marca, mensaje y buscador.

## Interacción

- La animación de inicio de las cuatro esferas pertenece al archivo de Spline.
- El evento Scroll de Spline controla `Reeded glass`, las esferas y `Backdrop`.
- La página acumula aproximadamente un viewport de desplazamiento mientras Spline completa la revelación.
- El desplazamiento de la página permanece bloqueado hasta que la revelación llega al 100%.
- El botón **Scroll to reveal** y el teclado completan la secuencia automáticamente.
- Al volver al inicio se restablece el bloqueo.

## Ajustes rápidos

En `assets/css/hero.css`:

- `--hero-video-opacity`: opacidad del video.
- `.hero__shade`: intensidad de los degradados.
- `.hero__content`: posición y ancho del contenido.

En `assets/js/hero.js`:

- `window.innerHeight * 0.9`: distancia de entrada necesaria para completar la revelación.
- `1800`: pausa final que mantiene el bloqueo mientras Spline termina su transición.
- `15000`: tiempo máximo para activar el respaldo si Spline no carga.

## Cambio pendiente en Spline

La escena publicada todavía cubre el video:

- `Backdrop` usa un material opaco.
- `Reeded glass` usa un material opaco.
- Las cuatro esferas también son opacas y llenan gran parte del encuadre.

El canvas ya tiene fondo transparente. Para lograr transparencia real:

1. Oculta o elimina `Backdrop`.
2. Reduce el alpha del material de `Reeded glass` en su estado de Scroll.
3. Reduce el alpha o aleja las esferas en sus estados de Scroll.
4. Publica nuevamente la escena.

Si la publicación conserva la URL actual, el prototipo se actualizará sin cambios. Si Spline genera otra URL, reemplaza el atributo `url` de `<spline-viewer>` en `index.html`.

## Respaldo

Si la escena tarda más de 15 segundos, falla o el usuario solicita movimiento reducido, el prototipo elimina la capa 3D, mantiene el video y no bloquea el desplazamiento.
