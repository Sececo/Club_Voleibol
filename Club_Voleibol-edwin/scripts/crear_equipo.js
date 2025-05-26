document.addEventListener("DOMContentLoaded", () => {
    const selectCategoriaEquipo = document.getElementById("categoria-equipo");
    const jugadoresSeleccionContainer = document.getElementById("jugadores-seleccion-container");
    const equipoNombreContainer = document.getElementById("equipo-nombre-container");
    const inputNombreEquipo = document.getElementById("nombre-equipo");
    const btnCrearEquipo = document.getElementById("btn-crear-equipo");
    const mensajeSeleccionJugadores = document.getElementById("mensaje-seleccion-jugadores");
    const formEquipo = document.getElementById("form-equipo");

    let deportistasDisponibles = [];
    const MIN_JUGADORES_EQUIPO = 9;

    function mostrarJugadores() {
        jugadoresSeleccionContainer.innerHTML = "";

        deportistasDisponibles.forEach((d, index) => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = d.id || index;
            checkbox.name = "jugadores";
            checkbox.dataset.nombre = `${d.nombres} ${d.apellidos}`;

            checkbox.addEventListener("change", validarSeleccion);

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${d.nombres} ${d.apellidos}`));
            jugadoresSeleccionContainer.appendChild(label);
            jugadoresSeleccionContainer.appendChild(document.createElement("br"));
        });
    }

    function validarSeleccion() {
        const seleccionados = jugadoresSeleccionContainer.querySelectorAll("input[type='checkbox']:checked");

        if (seleccionados.length >= MIN_JUGADORES_EQUIPO) {
            equipoNombreContainer.classList.remove("hidden");
            inputNombreEquipo.disabled = false;
            btnCrearEquipo.disabled = false;
            mensajeSeleccionJugadores.innerHTML = "";
        } else {
            equipoNombreContainer.classList.add("hidden");
            inputNombreEquipo.disabled = true;
            btnCrearEquipo.disabled = true;
            mensajeSeleccionJugadores.innerHTML = `<div class="alert alert-warning">Selecciona al menos ${MIN_JUGADORES_EQUIPO} jugadores.</div>`;
        }
    }

    selectCategoriaEquipo.addEventListener("change", () => {
        const categoriaSeleccionada = selectCategoriaEquipo.value;
        equipoNombreContainer.classList.add("hidden");
        inputNombreEquipo.disabled = true;
        btnCrearEquipo.disabled = true;
        mensajeSeleccionJugadores.innerHTML = "";
        deportistasDisponibles = [];

        if (!categoriaSeleccionada) {
            mensajeSeleccionJugadores.textContent = "Selecciona una categoría para ver los deportistas disponibles.";
            jugadoresSeleccionContainer.innerHTML = "";
            return;
        }

        const todosDeportistas = JSON.parse(localStorage.getItem("jugadores")) || [];

        deportistasDisponibles = todosDeportistas.filter(d =>
            d.categoria === categoriaSeleccionada && d.pago === true
        );

        if (deportistasDisponibles.length === 0) {
            jugadoresSeleccionContainer.innerHTML = "<p>No hay deportistas disponibles para esta categoría.</p>";
            return;
        }

        mostrarJugadores();
    });

    formEquipo.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = inputNombreEquipo.value.trim();
        if (nombre === "") {
            alert("El nombre del equipo no puede estar vacío.");
            return;
        }

        const seleccionados = jugadoresSeleccionContainer.querySelectorAll("input[type='checkbox']:checked");
        const jugadores = Array.from(seleccionados).map(c => ({
            id: c.value,
            nombre: c.dataset.nombre
        }));

        const nuevoEquipo = {
            nombre: nombre,
            categoria: selectCategoriaEquipo.value,
            jugadores: jugadores
        };

        const equipos = JSON.parse(localStorage.getItem("equipos")) || [];
        equipos.push(nuevoEquipo);
        localStorage.setItem("equipos", JSON.stringify(equipos));

        alert("¡Equipo creado exitosamente!");
        formEquipo.reset();
        jugadoresSeleccionContainer.innerHTML = "";
        equipoNombreContainer.classList.add("hidden");
    });
});
