document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const modo = urlParams.get("modo") || "consultar"; // "consultar" o "eliminar"

    const contenedor = document.getElementById("lista-deportistas");
    const mensajeNoJugadores = document.getElementById("mensaje-no-jugadores");
    const filtroContainer = document.getElementById("filtro-categorias");

    function mostrarDeportistas(filtro = "todas") {
        contenedor.innerHTML = "";
        let deportistas = JSON.parse(localStorage.getItem("jugadores")) || [];

        if (deportistas.length === 0) {
            mensajeNoJugadores.style.display = "block";
            filtroContainer.innerHTML = "";
            return;
        } else {
            mensajeNoJugadores.style.display = "none";
        }

        const categorias = [...new Set(deportistas.map(j => j.categoria))];

        filtroContainer.innerHTML = `
            <div class="filter-container">
                <label for="categoria-select">Filtrar por categoría:</label>
                <select id="categoria-select">
                    <option value="todas">Todas</option>
                    ${categorias.map(cat => `<option value="${cat}">${cat}</option>`).join("")}
                </select>
            </div>
        `;

        document.getElementById("categoria-select").addEventListener("change", (e) => {
            mostrarDeportistas(e.target.value);
        });

        const filtrados = filtro === "todas"
            ? deportistas
            : deportistas.filter(j => j.categoria === filtro);

        if (filtrados.length === 0) {
            contenedor.innerHTML = "<p>No hay deportistas en esta categoría.</p>";
            return;
        }

        filtrados.forEach((jugador, index) => {
            const div = document.createElement("div");
            div.classList.add("estado-cuenta");

            div.innerHTML = `
                <p><strong>Nombre:</strong> ${jugador.nombres} ${jugador.apellidos}</p>
                <p><strong>Categoría:</strong> ${jugador.categoria}</p>
                <p><strong>Estado de Pago:</strong> ${jugador.pago ? "Al día" : "Pendiente"}</p>
                ${modo === "eliminar" ? `<button class="btn-eliminar" data-index="${index}">Eliminar</button>` : ""}
            `;

            contenedor.appendChild(div);
        });

        if (modo === "eliminar") {
            document.querySelectorAll(".btn-eliminar").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const idx = e.target.getAttribute("data-index");
                    if (confirm("¿Estás seguro de que deseas eliminar este deportista?")) {
                        eliminarDeportista(parseInt(idx), filtro);
                    }
                });
            });
        }
    }

    function eliminarDeportista(index, filtro) {
        let deportistas = JSON.parse(localStorage.getItem("jugadores")) || [];
        deportistas.splice(index, 1);
        localStorage.setItem("jugadores", JSON.stringify(deportistas));
        mostrarDeportistas(filtro);
    }

    mostrarDeportistas();
});
