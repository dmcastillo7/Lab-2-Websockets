//Cliente Javascript para reservas de tickets websockets

const socket = io();

//Elementos con los que voy a interactuar
const usernameInput = document.getElementById('usernameInput');
const seating = document.getElementById('seating');
const buyBtn = document.getElementById('buyBtn');
const timerDisplay = document.getElementById('timerDisplay');

const selectedSeats = new Set();
let timerInterval = null;
let reservationEndTime = 0;
const seatPrices = {
    A: 6,
    B: 5,
    C: 4
};

const invoiceItems = document.getElementById('invoiceItems');
const totalPrice = document.getElementById('totalPrice');

//Crear los asientos en el DOM
function createSeats() {
    ['A', 'B', 'C'].forEach(row => {
        for (let i = 1; i <= 10; i++) {
            const seatId = `${row}${i}`;
            const div = document.createElement('div');
            div.className = 'seat';
            div.id = seatId;
            div.innerText = seatId;

            //Evento al hacer click en un asiento
            div.addEventListener('click', () => {
                const username = usernameInput.value.trim();

                if (!username) {
                    alert('Por favor, ingresa tu nombre antes de seleccionar un asiento.');
                    return;
                }

                socket.emit('setUsername', username);

                if (div.classList.contains('sold')) {
                    return;
                }

                // Si ya está reservado, solo se permite liberar la propia reserva
                if (div.classList.contains('reserved')) {
                    if (selectedSeats.has(seatId)) {
                        socket.emit('release', seatId);
                    } else {
                        alert('Este asiento ya está reservado por otro usuario.');
                    }

                    return;
                }

                // Solicitar reserva al servidor
                socket.emit('reserve', seatId);
            });
            seating.appendChild(div);
        }
    });
}

createSeats(); // Ejecutar la función para crear los asientos en el DOM

//Evento al hacer click en el botón de comprar
buyBtn.addEventListener('click', () => {
    if (selectedSeats.size === 0) {
        alert('No has seleccionado ningún asiento para comprar.');
        return;
    }

    socket.emit('buy', Array.from(selectedSeats));
    selectedSeats.clear();

    // Actualizar la factura después de comprar
    updateInvoice();
    stopTimer();
});

socket.on('init', (serverSeats) => {
    Object.entries(serverSeats).forEach(([id, info]) => {
        const seat = document.getElementById(id);

        seat.classList.remove('reserved', 'sold');
        seat.title = 'Disponible';

        if (info.status === 'reserved') {
            seat.classList.add('reserved');
            seat.title = `Reservado por: ${info.user}`;
        }

        if (info.status === 'sold') {
            seat.classList.add('sold');
            seat.title = `Vendido a: ${info.user}`;
        }
    });
});

//Actualizar estado de un asiento reservado
socket.on('reserve', ({ seatId, user, expiresAt }) => {
    const seat = document.getElementById(seatId);

    seat.classList.add('reserved');
    seat.title = `Reservado por: ${user}`;

    if (user === usernameInput.value.trim()) {
        selectedSeats.add(seatId);
        reservationEndTime = expiresAt;
        updateInvoice();
        startTimer();
    }
});

//Actualizar estado de un asiento liberado
socket.on('release', (seatId) => {
    const seat = document.getElementById(seatId);

    seat.classList.remove('reserved');
    seat.title = 'Disponible';

    selectedSeats.delete(seatId);
    updateInvoice();
    stopTimer();
});

//Actualizar estado de un asiento comprado
socket.on('buy', ({ seatIds, user }) => {
    seatIds.forEach(seatId => {
        const seat = document.getElementById(seatId);

        seat.classList.remove('reserved');
        seat.classList.add('sold');
        seat.title = `Vendido a: ${user}`;

        selectedSeats.delete(seatId);
    });

    updateInvoice();
    stopTimer();
});

//Mostrar el temporizador regresivo para la reserva
function startTimer() {
    stopTimer(); // Asegurarse de que no haya un temporizador previo corriendo
    timerInterval = setInterval(() => {
        const diff = Math.max(0, Math.floor((reservationEndTime - Date.now()) / 1000));
        timerDisplay.innerText = 'Tiempo restante: ' + diff + ' segundos';
        if (diff <= 0) {
            stopTimer();
        }
    }, 250);
};

//Detener el temporizador
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerDisplay.innerText = '';
    }
}

function updateInvoice() {
    invoiceItems.innerHTML = '';

    let total = 0;

    selectedSeats.forEach(seatId => {
        const row = seatId.charAt(0);
        const price = seatPrices[row];

        total += price;

        const item = document.createElement('li');
        item.innerText = `${seatId} - $${price.toFixed(2)}`;

        invoiceItems.appendChild(item);
    });

    totalPrice.innerText = `$${total.toFixed(2)}`;
}

updateInvoice();