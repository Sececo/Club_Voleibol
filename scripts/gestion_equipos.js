document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const modo = urlParams.get("modo") || "consultar"; // "consultar" o "eliminar" por defecto

    const contenedor = document.getElementById("lista-equipos");
    const mensajeNoEquipos = document.getElementById("mensaje-no-equipos");
    const filtroContainer = document.getElementById("filtro-categorias-equipos");

    function mostrarEquipos(filtro = "todas") {
        contenedor.innerHTML = "";
        let equipos = JSON.parse(localStorage.getItem("equipos")) || [];

        if (equipos.length === 0) {
            mensajeNoEquipos.style.display = "block";
            filtroContainer.innerHTML = ""; // Ocultar filtro si no hay equipos
            return;
        } else {
            mensajeNoEquipos.style.display = "none";
            // Re-generar el filtro si fue ocultado previamente y no existe
             if (!document.getElementById("categoria-select-equipos")) {
                const categorias = [...new Set(equipos.map(e => e.categoria))];
                filtroContainer.innerHTML = `
                    <div class="filter-container">
                        <label for="categoria-select-equipos">Filtrar por categoría:</label>
                        <select id="categoria-select-equipos">
                            <option value="todas">Todas</option>
                            ${categorias.map(cat => `<option value="${cat}">${cat}</option>`).join("")}
                        </select>
                    </div>
                `;
                // Añadir listener al cambio de categoría solo si se regenera el filtro
                document.getElementById("categoria-select-equipos").addEventListener("change", (e) => {
                    mostrarEquipos(e.target.value);
                });
                 // Asegurarse de que el filtro seleccionado persista después de la regeneración
                 const currentFilter = urlParams.get("filtroCategoria") || "todas";
                 document.getElementById("categoria-select-equipos").value = currentFilter;
            }
             // Actualizar el filtro si ya existe
             const categoriaSelect = document.getElementById("categoria-select-equipos");
             if (categoriaSelect && categoriaSelect.value !== filtro) {
                 categoriaSelect.value = filtro;
             }

        }

        const filtrados = filtro === "todas"
            ? equipos
            : equipos.filter(e => e.categoria === filtro);

        if (filtrados.length === 0) {
            contenedor.innerHTML = "<p>No hay equipos en esta categoría.</p>";
            return;
        }

        // Usaremos el índice original del equipo en el array completo para eliminar
        filtrados.forEach((equipo) => {
             // Encontrar el índice original del equipo en el array completo
            const indiceOriginal = equipos.findIndex(e =>
                e.nombre === equipo.nombre &&
                e.categoria === equipo.categoria // Asumiendo que nombre y categoría pueden identificar un equipo
            );

            if (indiceOriginal === -1) return; // Seguridad

            const div = document.createElement("div");
            div.classList.add("equipo-item"); // Clase para cada item de equipo

            div.innerHTML = `
                <p><strong>Nombre del Equipo:</strong> ${equipo.nombre}</p>
                <p><strong>Categoría:</strong> ${equipo.categoria}</p>
                <p><strong>Deportistas Asociados:</strong> ${equipo.deportistas ? equipo.deportistas.length : 0}</p>
                ${modo === "eliminar" ? `<button class="btn btn-eliminar" data-index="${indiceOriginal}">Eliminar</button>` : ""}
            `;

            contenedor.appendChild(div);
        });


        // Añadir listeners a los botones de eliminar si estamos en modo eliminar
        if (modo === "eliminar") {
            document.querySelectorAll(".btn-eliminar").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const idx = e.target.getAttribute("data-index");
                    if (confirm("¿Estás seguro de que deseas eliminar este equipo?")) {
                        eliminarEquipo(parseInt(idx)); // Eliminar del array completo
                    }
                });
            });
        }
    }

    // Función para eliminar equipo
    function eliminarEquipo(index) {
        let equipos = JSON.parse(localStorage.getItem("equipos")) || [];
        // Nota: La eliminación de un equipo no elimina a los deportistas asociados en esta lógica simple.
        // Considera si necesitas añadir lógica para manejar deportistas asociados al eliminar un equipo.
        equipos.splice(index, 1);
        localStorage.setItem("equipos", JSON.stringify(equipos));
        // Volver a mostrar los equipos con el filtro actual aplicado
        const categoriaSelect = document.getElementById("categoria-select-equipos");
        const currentFilter = categoriaSelect ? categoriaSelect.value : "todas";
        mostrarEquipos(currentFilter);
    }

    // Mostrar equipos al cargar la página
    mostrarEquipos();
});