//Servidor con Express + Socket.io para reservas de cine
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

//Instancia de la aplicación Express y del servidor HTTP
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de la carpeta pública
app.use(express.static(path.join(__dirname, 'public')));

//Estado global de los asientos
let seats = {};

//Crear asientos A1-A10, B1-B10, C1-C10
['A', 'B', 'C'].forEach(row => {
    for (let i = 1; i <= 10; i++) {
        seats[`${row}${i}`] = { status: 'available', user: '', expiresAt: 0 };
    }
});

//Manejo de conexion de clientes
io.on('connection', (socket) => {
    //Emitir estado actual de los asientos al nuevo cliente
    socket.emit('init', seats);

    //Registrar el nombre del usuario del cliente
    socket.on('setUsername', (username) => {
        socket.username = username;
    });

    //Manejar reserva de asiento
    socket.on('reserve', (seatId) => {
        const seat = seats[seatId];
        if (seat.status === 'available') {
            seat.status = 'reserved';
            seat.user = socket.username;
            seat.expiresAt = Date.now() + 60000; // 60 segundos de expiración

            //Enviar asiento reservado a todos los clientes
            io.emit('reserve', { seatId, user: seat.user, expiresAt: seat.expiresAt });

            //Liberar el asiento después de 60 segundos si no se confirma la reserva
            setTimeout(() => {
                if (seats[seatId].status === 'reserved' && Date.now() >= seats[seatId].expiresAt) {
                    seats[seatId] = {
                        status: 'available',
                        user: '',
                        expiresAt: 0
                    };
                    io.emit('release', seatId);
                }
            }, 60000);
        }
    });

    //Manejar liberación de asiento manualmente
    socket.on('release', (seatId) => {
        const seat = seats[seatId];
        if (seat.status === 'reserved' && seat.user === socket.username) {
            seats[seatId] = { status: 'available', user: '', expiresAt: 0 };
            io.emit('release', seatId);
        }
    });

    //Confirma compra de uno o más asientos
    socket.on('buy', (seatIds) => {
        const validSeats = seatIds.filter(seatId => {
            const seat = seats[seatId];

            return seat &&
                seat.status === 'reserved' &&
                seat.user === socket.username;
        });

        validSeats.forEach(seatId => {
            seats[seatId] = {
                status: 'sold',
                user: socket.username,
                expiresAt: 0
            };
        });

        if (validSeats.length > 0) {
            io.emit('buy', {
                seatIds: validSeats,
                user: socket.username
            });
        }
    });

    // Liberar todas las reservas activas desde el panel administrativo
    socket.on('adminReleaseAll', () => {
        Object.keys(seats).forEach(seatId => {
            if (seats[seatId].status === 'reserved') {
                seats[seatId] = {
                    status: 'available',
                    user: '',
                    expiresAt: 0
                };
            }
        });

        io.emit('init', seats);
    });

    // Restablecer todos los asientos a su estado inicial
    socket.on('adminReset', () => {
        Object.keys(seats).forEach(seatId => {
            seats[seatId] = {
                status: 'available',
                user: '',
                expiresAt: 0
            };
        });

        io.emit('init', seats);
    });

});


const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});