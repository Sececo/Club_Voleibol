document.addEventListener('DOMContentLoaded', function() {
    const listaDeportistasDiv = document.getElementById('lista-deportistas');
    const accionesDeportistaDiv = document.getElementById('acciones-deportista');
    const urlParams = new URLSearchParams(window.location.search);
    const accion = urlParams.get('accion');

    // Simulación inicial de la lista de deportistas - ¡INICIALMENTE VACÍA!
    let deportistas = obtenerDeportistasSimulados();
    mostrarListaSiHayJugadores(deportistas, accion); // Usamos la nueva función

    if (accion === 'consultar') {
        accionesDeportistaDiv.innerHTML = '<p>Seleccione un jugador para ver sus detalles.</p>';
    } else if (accion === 'eliminar') {
        accionesDeportistaDiv.innerHTML = '<p>Haga clic en "Eliminar" junto al jugador para eliminarlo.</p>';
    }

    // Función simulada para agregar un nuevo deportista (esto no persiste)
    window.agregarDeportistaSimulado = function(nuevoDeportista) {
        deportistas.push(nuevoDeportista);
        mostrarListaSiHayJugadores(deportistas, accion, document.getElementById('categoria')?.value); // Actualizamos al agregar
    };

    // ¡ELIMINAMOS LA CREACIÓN DEL BOTÓN DE PRUEBA!
    // const botonAgregarSimulado = document.createElement('button');
    // botonAgregarSimulado.textContent = 'Agregar Deportista de Prueba';
    // botonAgregarSimulado.onclick = function() {
    //     const nuevo = { id: Date.now(), nombre: 'Nuevo Jugador', categoria: obtenerCategorias()[Math.floor(Math.random() * obtenerCategorias().length)] };
    //     agregarDeportistaSimulado(nuevo);
    // };
    // document.querySelector('main').appendChild(botonAgregarSimulado);
});

function obtenerDeportistasSimulados() {
    return [
        // ¡Comenta esta lista para que inicialmente no haya jugadores!
        // { id: 1, nombre: 'Ana Pérez', categoria: 'Infantil' },
        // { id: 2, nombre: 'Carlos López', categoria: 'Juvenil' },
        // { id: 3, nombre: 'Sofía Gómez', categoria: 'Mayor' },
        // { id: 4, nombre: 'Mateo Vargas', categoria: 'Infantil' }
    ];
}

function obtenerCategorias() {
    return ['Benjamin', 'Mini', 'Infantil'];
}

function mostrarListaSiHayJugadores(deportistas, accion, filtroCategoria = '') {
    const listaDeportistasDiv = document.getElementById('lista-deportistas');
    listaDeportistasDiv.innerHTML = ''; // Limpiar cualquier contenido previo

    if (deportistas.length > 0) {
        const categorias = obtenerCategorias();
        let filtroHTML = '<div class="filter-container"><label for="categoria">Filtrar por categoría:</label>';
        filtroHTML += '<select id="categoria" onchange="filtrarDeportistas(\'' + accion + '\')">';
        filtroHTML += '<option value="">Todas</option>';
        categorias.forEach(cat => {
            filtroHTML += `<option value="${cat}">${cat}</option>`;
        });
        filtroHTML += '</select></div>';
        listaDeportistasDiv.insertAdjacentHTML('beforebegin', filtroHTML);

        const deportistasFiltrados = filtroCategoria
            ? deportistas.filter(dep => dep.categoria.toLowerCase() === filtroCategoria.toLowerCase())
            : deportistas;

        if (deportistasFiltrados.length > 0) {
            const listaHTML = '<ul>' + deportistasFiltrados.map(deportista => `
                <li class="deportista-item">
                    <span>${deportista.nombre} (Categoría: ${deportista.categoria})</span>
                    ${accion === 'consultar' ? '<button class="accion-button consultar" onclick="consultarDeportista(' + deportista.id + ')">Consultar</button>' : ''}
                    ${accion === 'eliminar' ? '<button class="accion-button eliminar" onclick="eliminarDeportista(' + deportista.id + ')">Eliminar</button>' : ''}
                </li>
            `).join('') + '</ul>';
            listaDeportistasDiv.innerHTML = listaHTML;
        } else {
            listaDeportistasDiv.innerHTML = '<p>No hay jugadores en la categoría seleccionada.</p>';
        }
    } else {
        listaDeportistasDiv.innerHTML = '<p>No hay jugadores registrados.</p>';
    }
}

function filtrarDeportistas(accion) {
    const categoriaSeleccionada = document.getElementById('categoria').value;
    const deportistas = obtenerDeportistasSimulados(); // Obtener la lista actual
    mostrarListaSiHayJugadores(deportistas, accion, categoriaSeleccionada); // Usamos la nueva función
}

function consultarDeportista(id) {
    alert('Función para consultar al deportista con ID: ' + id + ' aún no implementada.');
    console.log('Consultar deportista ID:', id);
    // Aquí iría la lógica para mostrar los detalles del deportista
}

function eliminarDeportista(id) {
    const listaDeportistasDiv = document.getElementById('lista-deportistas');
    let deportistas = obtenerDeportistasSimulados(); // Obtener la lista actual
    deportistas = deportistas.filter(dep => dep.id !== id);
    // Aquí iría la lógica real para eliminar (actualizar la simulación)
    window.obtenerDeportistasSimulados = function() { // Actualizar la función de obtención
        return deportistas;
    };
    mostrarListaSiHayJugadores(deportistas, 'eliminar', document.getElementById('categoria')?.value); // Usamos la nueva función
}

function obtenerDeportistasSimulados() {
    return [
        // ¡Comenta esta lista para que inicialmente no haya jugadores!
        // { id: 1, nombre: 'Ana Pérez', categoria: 'Infantil' },
        // { id: 2, nombre: 'Carlos López', categoria: 'Juvenil' },
        // { id: 3, nombre: 'Sofía Gómez', categoria: 'Mayor' },
        // { id: 4, nombre: 'Mateo Vargas', categoria: 'Infantil' }
    ];
}

function obtenerCategorias() {
    return ['Benjamin', 'Mini', 'Infantil'];
}