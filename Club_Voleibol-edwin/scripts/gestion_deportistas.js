document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const modo = urlParams.get("modo") || "consultar"; // "consultar" o "eliminar" por defecto

    const contenedor = document.getElementById("lista-deportistas");
    const mensajeNoJugadores = document.getElementById("mensaje-no-jugadores");
    const filtroContainer = document.getElementById("filtro-categorias"); // Asegúrate de que este ID exista en el HTML

    // Referencias modal y botones dentro del modal
    const modalEditar = document.getElementById("modal-editar");
    const btnAceptarModal = document.getElementById("btn-aceptar");
    const btnCancelarModal = document.getElementById("btn-cancelar");

    // Variable para guardar el índice del jugador a editar
    let indiceJugadorEditar = null;

    function mostrarDeportistas(filtro = "todas") {
        contenedor.innerHTML = "";
        let deportistas = JSON.parse(localStorage.getItem("jugadores")) || [];

        if (deportistas.length === 0) {
            mensajeNoJugadores.style.display = "block";
            filtroContainer.innerHTML = ""; // Ocultar filtro si no hay jugadores
            return;
        } else {
            mensajeNoJugadores.style.display = "none";
            if (!document.getElementById("categoria-select")) {
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
                const currentFilter = urlParams.get("filtroCategoria") || "todas";
                document.getElementById("categoria-select").value = currentFilter;
            }
            const categoriaSelect = document.getElementById("categoria-select");
            if (categoriaSelect && categoriaSelect.value !== filtro) {
                categoriaSelect.value = filtro;
            }
        }

        const filtrados = filtro === "todas"
            ? deportistas
            : deportistas.filter(j => j.categoria === filtro);

        if (filtrados.length === 0) {
            contenedor.innerHTML = "<p>No hay deportistas en esta categoría.</p>";
            return;
        }

        filtrados.forEach((jugador) => {
            const indiceOriginal = deportistas.findIndex(d =>
                d.nombres === jugador.nombres &&
                d.apellidos === jugador.apellidos &&
                d.documento === jugador.documento
            );

            if (indiceOriginal === -1) return;

            const div = document.createElement("div");
            div.classList.add("deportista-item");

            div.innerHTML = `
                <p><strong>Nombre:</strong> ${jugador.nombres} ${jugador.apellidos}</p>
                <p><strong>Categoría:</strong> ${jugador.categoria}</p>
                <p><strong>Estado de Pago:</strong> ${jugador.pago ? "Al día" : "Pendiente"}</p>
                <button class="btn btn-descargar" data-index="${indiceOriginal}">Descargar PDF</button>
                ${modo === "eliminar" ? `<button class="btn btn-eliminar" data-index="${indiceOriginal}">Eliminar</button>` : ""}
            `;

            contenedor.appendChild(div);

            // Agregar botón Editar después del botón Descargar PDF
            const btnDescargar = div.querySelector(".btn-descargar");
            if (btnDescargar) {
                const btnEditar = document.createElement("button");
                btnEditar.textContent = "Editar";
                btnEditar.classList.add("btn-editar");
                btnDescargar.insertAdjacentElement("afterend", btnEditar);

                // Al hacer clic en Editar, mostrar modal y guardar índice
                btnEditar.addEventListener("click", () => {
                    indiceJugadorEditar = indiceOriginal;
                    modalEditar.style.display = "block";
                });
            }
        });

        // Listeners botones descargar
        document.querySelectorAll(".btn-descargar").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.target.getAttribute("data-index");
                descargarPDF(parseInt(idx));
            });
        });

        // Listeners botones eliminar si modo eliminar
        if (modo === "eliminar") {
            document.querySelectorAll(".btn-eliminar").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const idx = e.target.getAttribute("data-index");
                    if (confirm("¿Estás seguro de que deseas eliminar este deportista?")) {
                        eliminarDeportista(parseInt(idx));
                    }
                });
            });
        }
    }

    // Descargar PDF
    function descargarPDF(index) {
        const jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
        const jugador = jugadores[index];
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(14);
        doc.text("Estado de Cuenta - Club de Voleibol", 20, 20);
        doc.text(`Nombre: ${jugador.nombres} ${jugador.apellidos}`, 20, 40);
        doc.text(`Categoría: ${jugador.categoria}`, 20, 50);
        doc.text(`Estado de Pago: ${jugador.pago ? "Al día" : "Pendiente"}`, 20, 60);

        doc.save(`estado_${jugador.nombres.replace(/\s/g, '')}_${jugador.apellidos.replace(/\s/g, '')}.pdf`);
    }

    // Eliminar deportista
    function eliminarDeportista(index) {
        let deportistas = JSON.parse(localStorage.getItem("jugadores")) || [];
        deportistas.splice(index, 1);
        localStorage.setItem("jugadores", JSON.stringify(deportistas));
        const categoriaSelect = document.getElementById("categoria-select");
        const currentFilter = categoriaSelect ? categoriaSelect.value : "todas";
        mostrarDeportistas(currentFilter);
    }

    // Eventos modal botones Aceptar y Cancelar
    btnAceptarModal.addEventListener("click", () => {
        if (indiceJugadorEditar !== null) {
            // Redirigir a editar con índice
            window.location.href = `editar.html?index=${indiceJugadorEditar}`;
            indiceJugadorEditar = null;
        }
        modalEditar.style.display = "none";
    });

    btnCancelarModal.addEventListener("click", () => {
        modalEditar.style.display = "none";
        indiceJugadorEditar = null;
    });

    // Cerrar modal si se hace clic fuera del contenido
    window.addEventListener("click", (event) => {
        if (event.target === modalEditar) {
            modalEditar.style.display = "none";
            indiceJugadorEditar = null;
        }
    });

    // Mostrar deportistas al cargar
    mostrarDeportistas();
});
