# Especificación: hero con Spline

## Composición

El hero debe mostrar el video de MandalaTickets debajo de una escena publicada de Spline. Un degradado debe mantener el contraste y el contenido debe permanecer por encima de las capas visuales.

### Escenario: carga correcta

**DADO** que el navegador admite el componente de Spline  
**CUANDO** la escena termina de cargar  
**ENTONCES** el video debe continuar reproduciéndose debajo de la escena  
**Y** el mensaje y los controles deben permanecer utilizables.

### Escenario: selección del video optimizado

**DADO** que el navegador carga el hero  
**CUANDO** selecciona una fuente de video compatible  
**ENTONCES** debe usar la variante MP4 de 720p en pantallas pequeñas  
**Y** debe usar la variante de 1080p en pantallas mayores  
**Y** debe mostrar un poster local mientras inicia la reproducción.

## Revelación

El hero debe preparar una única revelación antes de permitir que el usuario continúe por la página.

### Escenario: primer gesto hacia abajo

**DADO** que la página está al inicio y la escena está lista  
**CUANDO** el usuario acumula desplazamiento con rueda o toque  
**ENTONCES** Spline debe recibir cada gesto de desplazamiento  
**Y** el documento debe permanecer bloqueado mientras la revelación esté incompleta  
**Y** debe liberar su desplazamiento únicamente después de completar la revelación.

### Escenario: alternativa accesible

**DADO** que la página está bloqueada al inicio  
**CUANDO** el usuario activa el control visible o una tecla de avance  
**ENTONCES** el prototipo debe completar automáticamente la revelación  
**Y** después debe continuar al contenido siguiente.

### Escenario: reinicio

**DADO** que el usuario ya avanzó  
**CUANDO** vuelve al inicio  
**ENTONCES** el hero debe preparar nuevamente la revelación.

## Respaldo

### Escenario: Spline no disponible

**DADO** que la escena falla, excede su tiempo de carga o el usuario solicita movimiento reducido  
**CUANDO** se muestra el hero  
**ENTONCES** la capa 3D debe ocultarse  
**Y** el video debe seguir visible  
**Y** el desplazamiento debe permanecer libre.
