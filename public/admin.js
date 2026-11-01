const socket = io();

function renderSeats(seats) {
    let available = 0;
    let reserved = 0;
    let sold = 0;

    const statusLabels = {
        available: 'Disponible',
        reserved: 'Reservado',
        sold: 'Vendido'
    };

    const table = document.getElementById('seatTable');
    table.innerHTML = '';

    Object.entries(seats).forEach(([seatId, seat]) => {
        if (seat.status === 'available') available++;
        if (seat.status === 'reserved') reserved++;
        if (seat.status === 'sold') sold++;

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${seatId}</td>
            <td>${statusLabels[seat.status] || seat.status}</td>
            <td>${seat.user || 'Sin usuario'}</td>
        `;

        table.appendChild(row);
    });

    document.getElementById('available').innerText = available;
    document.getElementById('reserved').innerText = reserved;
    document.getElementById('sold').innerText = sold;
}

socket.on('init', seats => {
    renderSeats(seats);
});

socket.on('reserve', () => {
    location.reload();
});

socket.on('release', () => {
    location.reload();
});

socket.on('buy', () => {
    location.reload();
});

document.getElementById('releaseAll').addEventListener('click', () => {
    socket.emit('adminReleaseAll');
});

document.getElementById('resetSeats').addEventListener('click', () => {
    socket.emit('adminReset');
});