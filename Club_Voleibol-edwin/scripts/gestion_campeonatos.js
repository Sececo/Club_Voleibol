document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const modo = urlParams.get("modo") || "consultar"; // "consultar" o "eliminar" por defecto

    const contenedor = document.getElementById("lista-campeonatos");
    const mensajeNoCampeonatos = document.getElementById("mensaje-no-campeonatos");
    const filtroContainer = document.getElementById("filtro-categorias-campeonatos");

    function mostrarCampeonatos(filtro = "todas") {
        contenedor.innerHTML = "";
        let campeonatos = JSON.parse(localStorage.getItem("campeonatos")) || [];

        if (campeonatos.length === 0) {
            mensajeNoCampeonatos.style.display = "block";
            filtroContainer.innerHTML = ""; // Ocultar filtro si no hay campeonatos
            return;
        } else {
            mensajeNoCampeonatos.style.display = "none";
            // Re-generar el filtro si fue ocultado previamente y no existe
             if (!document.getElementById("categoria-select-campeonatos")) {
                const categorias = [...new Set(campeonatos.map(c => c.categoria))];
                filtroContainer.innerHTML = `
                    <div class="filter-container">
                        <label for="categoria-select-campeonatos">Filtrar por categoría:</label>
                        <select id="categoria-select-campeonatos">
                            <option value="todas">Todas</option>
                            ${categorias.map(cat => `<option value="${cat}">${cat}</option>`).join("")}
                        </select>
                    </div>
                `;
                // Añadir listener al cambio de categoría solo si se regenera el filtro
                document.getElementById("categoria-select-campeonatos").addEventListener("change", (e) => {
                    mostrarCampeonatos(e.target.value);
                });
                 // Asegurarse de que el filtro seleccionado persista después de la regeneración
                 const currentFilter = urlParams.get("filtroCategoria") || "todas";
                 document.getElementById("categoria-select-campeonatos").value = currentFilter;
            }
             // Actualizar el filtro si ya existe
             const categoriaSelect = document.getElementById("categoria-select-campeonatos");
             if (categoriaSelect && categoriaSelect.value !== filtro) {
                 categoriaSelect.value = filtro;
             }
        }

        const filtrados = filtro === "todas"
            ? campeonatos
            : campeonatos.filter(c => c.categoria === filtro);

        if (filtrados.length === 0) {
            contenedor.innerHTML = "<p>No hay campeonatos en esta categoría.</p>";
            return;
        }

        // Usaremos el índice original del campeonato en el array completo para eliminar
        filtrados.forEach((campeonato) => {
             // Encontrar el índice original del campeonato en el array completo
             // Podríamos usar un ID único si los tuvieran, pero usaremos una combinación de campos
            const indiceOriginal = campeonatos.findIndex(c =>
                c.nombre === campeonato.nombre &&
                c.fecha === campeonato.fecha && // Asumiendo que nombre y fecha pueden identificar un campeonato
                c.categoria === campeonato.categoria
            );

            if (indiceOriginal === -1) return; // Seguridad

            const div = document.createElement("div");
            div.classList.add("campeonato-item"); // Clase para cada item de campeonato

            div.innerHTML = `
                <p><strong>Nombre del Campeonato:</strong> ${campeonato.nombre}</p>
                <p><strong>Categoría:</strong> ${campeonato.categoria}</p>
                <p><strong>Fecha:</strong> ${campeonato.fecha}</p>
                <p><strong>Hora:</strong> ${campeonato.hora}</p>
                <p><strong>Sede:</strong> ${campeonato.sede}</p>
                ${modo === "eliminar" ? `<button class="btn btn-eliminar" data-index="${indiceOriginal}">Eliminar</button>` : ""}
            `;

            contenedor.appendChild(div);
        });


        // Añadir listeners a los botones de eliminar si estamos en modo eliminar
        if (modo === "eliminar") {
            document.querySelectorAll(".btn-eliminar").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const idx = e.target.getAttribute("data-index");
                    if (confirm("¿Estás seguro de que deseas eliminar este campeonato?")) {
                        eliminarCampeonato(parseInt(idx)); // Eliminar del array completo
                    }
                });
            });
        }
    }

    // Función para eliminar campeonato
    function eliminarCampeonato(index) {
        let campeonatos = JSON.parse(localStorage.getItem("campeonatos")) || [];
        campeonatos.splice(index, 1);
        localStorage.setItem("campeonatos", JSON.stringify(campeonatos));
        // Volver a mostrar los campeonatos con el filtro actual aplicado
        const categoriaSelect = document.getElementById("categoria-select-campeonatos");
        const currentFilter = categoriaSelect ? categoriaSelect.value : "todas";
        mostrarCampeonatos(currentFilter);
    }

    // Mostrar campeonatos al cargar la página
    mostrarCampeonatos();
});