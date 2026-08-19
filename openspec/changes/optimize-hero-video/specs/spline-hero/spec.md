# Delta de especificación: video optimizado del hero

## Requisito: fuentes locales responsivas

### Escenario: pantalla pequeña

**DADO** que el viewport mide hasta 767 px de ancho  
**CUANDO** el navegador selecciona el video del hero  
**ENTONCES** debe cargar la variante MP4 de 720p.

### Escenario: pantalla grande

**DADO** que el viewport mide más de 767 px de ancho  
**CUANDO** el navegador selecciona el video del hero  
**ENTONCES** debe cargar la variante MP4 de 1080p.

### Escenario: espera de reproducción

**DADO** que el archivo de video aún no inicia  
**CUANDO** se muestra el hero  
**ENTONCES** debe aparecer un poster local representativo.
