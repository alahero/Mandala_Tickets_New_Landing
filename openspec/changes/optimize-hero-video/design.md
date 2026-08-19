# Diseño técnico

## Codificación

El video fuente se convierte a H.264 en MP4. Los archivos incluyen `faststart`, omiten el audio y mantienen la velocidad original de 30 FPS.

## Selección responsiva

El elemento `<video>` declara primero la fuente de 720p con una condición para pantallas de hasta 767 px. Después declara la fuente de 1080p para pantallas mayores.

## Carga inicial

El video usa `preload="metadata"` y un poster WebP local. La reproducción automática puede hacer que el navegador descargue el archivo completo, pero la variante elegida es considerablemente menor que el archivo original.

## Decisión de formato

Las pruebas de VP9 produjeron archivos mayores que los MP4 para este material visual, por lo que se descartaron. H.264 ofrece la mejor relación entre peso, calidad y compatibilidad para estas variantes. La composición, el control de desplazamiento y la integración con Spline no cambian.
