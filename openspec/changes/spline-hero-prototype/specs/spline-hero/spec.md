# Delta de especificación: hero con Spline

## Requisito: composición por capas

### Escenario: carga inicial del hero

**DADO** que la página termina de cargar  
**CUANDO** el navegador muestra el primer viewport  
**ENTONCES** el video debe estar debajo de la escena de Spline  
**Y** el contenido debe permanecer legible y utilizable sobre ambas capas.

## Requisito: revelación por desplazamiento

### Escenario: primer intento de avanzar

**DADO** que el usuario se encuentra al inicio de la página  
**CUANDO** acumula desplazamiento hacia abajo con rueda o toque  
**ENTONCES** la escena debe recibir cada gesto  
**Y** la página debe permanecer bloqueada hasta completar la revelación  
**Y** después debe liberar el desplazamiento.

### Escenario: regreso al inicio

**DADO** que la revelación ya ocurrió  
**CUANDO** el usuario vuelve al inicio de la página  
**ENTONCES** el prototipo debe preparar nuevamente el primer gesto de revelación.

## Requisito: respaldo accesible

### Escenario: movimiento reducido o error de Spline

**DADO** que el usuario solicita movimiento reducido o la escena no carga  
**CUANDO** se muestra el hero  
**ENTONCES** el video debe permanecer visible  
**Y** la página no debe bloquear el desplazamiento.
