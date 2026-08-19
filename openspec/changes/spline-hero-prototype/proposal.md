# Propuesta: prototipo de hero con Spline

## Propósito

Crear un prototipo local del hero de MandalaTickets que conserve el video de fondo y sustituya la cortina de franjas por la escena publicada de Spline.

## Alcance

- Mostrar el video actual como fondo del hero.
- Superponer la escena de Spline con fondo transparente.
- Conservar el contenido y buscador por encima de las capas visuales.
- Mantener un primer gesto de avance que activa la revelación y después libera el desplazamiento.
- Ofrecer una alternativa sin WebGL para movimiento reducido y dispositivos de bajo rendimiento.

## Fuera de alcance

- Modificar el archivo fuente dentro del editor de Spline.
- Integrar el buscador con datos reales.
- Sustituir archivos del sitio productivo.

## Criterios de éxito

- El prototipo abre localmente sin proceso de compilación.
- La escena carga desde la URL publicada.
- El video permanece debajo de la escena.
- El contenido y los controles siguen siendo utilizables.
- El primer gesto de rueda, teclado, toque o botón libera el desplazamiento.
- La experiencia ofrece una ruta de respaldo sin Spline.
