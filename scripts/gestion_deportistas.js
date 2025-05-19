document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const modo = urlParams.get("modo") || "consultar"; // "consultar" o "eliminar" por defecto

    const contenedor = document.getElementById("lista-deportistas");
    const mensajeNoJugadores = document.getElementById("mensaje-no-jugadores");
    const filtroContainer = document.getElementById("filtro-categorias"); // Asegúrate de que este ID exista en el HTML

    function mostrarDeportistas(filtro = "todas") {
        contenedor.innerHTML = "";
        let deportistas = JSON.parse(localStorage.getItem("jugadores")) || [];

        if (deportistas.length === 0) {
            mensajeNoJugadores.style.display = "block";
            filtroContainer.innerHTML = ""; // Ocultar filtro si no hay jugadores
            return;
        } else {
            mensajeNoJugadores.style.display = "none";
            // Re-generar el filtro si fue ocultado previamente y no existe
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
                // Añadir listener al cambio de categoría solo si se regenera el filtro
                document.getElementById("categoria-select").addEventListener("change", (e) => {
                    mostrarDeportistas(e.target.value);
                });
                 // Asegurarse de que el filtro seleccionado persista después de la regeneración
                 const currentFilter = urlParams.get("filtroCategoria") || "todas";
                 document.getElementById("categoria-select").value = currentFilter;
            }
             // Actualizar el filtro si ya existe
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

        // Usaremos el índice original del deportista en el array completo para eliminar o descargar
        filtrados.forEach((jugador) => {
             // Encontrar el índice original del jugador en el array completo
            const indiceOriginal = deportistas.findIndex(d =>
                d.nombres === jugador.nombres &&
                d.apellidos === jugador.apellidos &&
                d.documento === jugador.documento // Asumiendo que el documento es único para identificar
            );

            if (indiceOriginal === -1) return; // No debería pasar si se filtra correctamente, pero es una seguridad

            const div = document.createElement("div");
            div.classList.add("deportista-item"); // Clase para cada deportista

            div.innerHTML = `
                <p><strong>Nombre:</strong> ${jugador.nombres} ${jugador.apellidos}</p>
                <p><strong>Categoría:</strong> ${jugador.categoria}</p>
                <p><strong>Estado de Pago:</strong> ${jugador.pago ? "Al día" : "Pendiente"}</p>
                <button class="btn btn-descargar" data-index="${indiceOriginal}">Descargar PDF</button>
                ${modo === "eliminar" ? `<button class="btn btn-eliminar" data-index="${indiceOriginal}">Eliminar</button>` : ""}
            `;

            contenedor.appendChild(div);
        });

        // Añadir listeners a los botones de descargar PDF
        document.querySelectorAll(".btn-descargar").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.target.getAttribute("data-index");
                descargarPDF(parseInt(idx));
            });
        });

        // Añadir listeners a los botones de eliminar si estamos en modo eliminar
        if (modo === "eliminar") {
            document.querySelectorAll(".btn-eliminar").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const idx = e.target.getAttribute("data-index");
                    if (confirm("¿Estás seguro de que deseas eliminar este deportista?")) {
                        eliminarDeportista(parseInt(idx)); // Eliminar del array completo
                    }
                });
            });
        }
    }

    // Función para descargar PDF (copiada de estado_cuenta.js y adaptada)
    function descargarPDF(index) {
        const jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
        const jugador = jugadores[index];
        // Asegúrate de que window.jspdf está disponible (ver la inclusión en el HTML)
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(14);
        doc.text("Estado de Cuenta - Club de Voleibol", 20, 20);
        doc.text(`Nombre: ${jugador.nombres} ${jugador.apellidos}`, 20, 40);
        doc.text(`Categoría: ${jugador.categoria}`, 20, 50);
        doc.text(`Estado de Pago: ${jugador.pago ? "Al día" : "Pendiente"}`, 20, 60);

        // Usa el nombre y apellido para el nombre del archivo, reemplazando espacios
        doc.save(`estado_${jugador.nombres.replace(/\s/g, '')}_${jugador.apellidos.replace(/\s/g, '')}.pdf`);
    }

    // Función para eliminar deportista (existente en gestion_deportistas.js y adaptada)
    function eliminarDeportista(index) {
        let deportistas = JSON.parse(localStorage.getItem("jugadores")) || [];
        deportistas.splice(index, 1);
        localStorage.setItem("jugadores", JSON.stringify(deportistas));
        // Volver a mostrar los deportistas con el filtro actual aplicado
        const categoriaSelect = document.getElementById("categoria-select");
        const currentFilter = categoriaSelect ? categoriaSelect.value : "todas";
        mostrarDeportistas(currentFilter);
    }

    // Mostrar deportistas al cargar la página
    mostrarDeportistas();
});