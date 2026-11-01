# Sistema de reserva de asientos con WebSockets

Aplicación distribuida para reservar asientos de cine en tiempo real. Fue desarrollada con Node.js, Express y Socket.IO como parte del laboratorio de Aplicaciones Distribuidas.

## Descripción

El sistema permite que varios clientes se conecten simultáneamente a una sala de cine y compartan el estado de sus asientos. Cuando un usuario reserva, libera o compra un asiento, los demás clientes reciben la actualización sin tener que recargar la página.

La sala contiene treinta asientos distribuidos en tres filas:

- Fila A: asientos A1-A10, precio de $6.00.
- Fila B: asientos B1-B10, precio de $5.00.
- Fila C: asientos C1-C10, precio de $4.00.

## Funcionalidades

- Visualización de asientos disponibles, reservados y vendidos.
- Comunicación bidireccional mediante Socket.IO.
- Sincronización del estado entre múltiples clientes.
- Reservas temporales con expiración de 60 segundos.
- Liberación manual de reservas.
- Validación para que un usuario solo compre sus propias reservas.
- Tooltip con el nombre del usuario que reservó o compró el asiento.
- Cálculo del precio total y resumen de compra.
- Panel administrativo con contadores y estado global.
- Liberación de reservas desde el panel administrativo.
- Restablecimiento completo de la sala.

## Tecnologías utilizadas

- Node.js
- Express
- Socket.IO
- JavaScript
- HTML5
- CSS3

## Requisitos

- Node.js instalado.
- npm instalado.
- Navegador web actualizado.

Verificar las versiones instaladas:

```bash
node --version
npm --version
```

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/dmcastillo7/Lab-2-Websockets.git
```

Ingresar a la carpeta del proyecto:

```bash
cd Lab 2 Websockets
```

Instalar las dependencias:

```bash
npm install
```

## Ejecución

Iniciar el servidor:

```bash
npm start
```

También puede ejecutarse directamente con:

```bash
node server.js
```

Cuando el servidor se inicia correctamente, se muestra:

```text
Servidor activo en http://localhost:3000
```

## Acceso a la aplicación

Página principal para los usuarios:

```text
http://localhost:3000/
```

Panel administrativo:

```text
http://localhost:3000/admin.html
```

## Pruebas sugeridas

1. Abrir la página principal en dos ventanas del navegador.
2. Ingresar un nombre diferente en cada ventana.
3. Reservar un mismo asiento desde una de las ventanas.
4. Verificar que el asiento aparezca como reservado en ambas ventanas.
5. Pasar el cursor sobre el asiento para observar el usuario propietario.
6. Esperar 60 segundos y comprobar que la reserva se libere automáticamente.
7. Reservar uno o más asientos y verificar el resumen de compra.
8. Comprar los asientos reservados.
9. Abrir el panel administrativo.
10. Verificar los contadores de asientos disponibles, reservados y vendidos.
11. Probar las opciones de liberar reservas y resetear la sala.

## Consideraciones

El estado de los asientos se mantiene en memoria del servidor. Por lo tanto, la información se reinicia cuando el servidor se detiene. Para un sistema real sería recomendable utilizar una base de datos, autenticación administrativa y control de usuarios.

## Autor

Darío Miguel Castillo Salazar
