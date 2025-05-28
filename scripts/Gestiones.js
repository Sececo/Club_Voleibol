document.addEventListener("DOMContentLoaded", () => {
    // Detectar tipo y modo:
    const tipo = document.body.getAttribute("data-tipo"); // "deportistas", "campeonatos" o "equipos"
    const urlParams = new URLSearchParams(window.location.search);
    const modo = urlParams.get("modo") || "consultar"; // consultar o eliminar

    if (!["deportistas", "campeonatos", "equipos"].includes(tipo)) {
        console.error("Tipo inválido en data-tipo");
        return;
    }

    const contenedor = document.getElementById("lista-items");
    const mensajeNoItems = document.getElementById("mensaje-no-items");
    const filtroContainer = document.getElementById("filtro-categorias");

    // Claves en localStorage según tipo
    const clavesStorage = {
        deportistas: "jugadores",
        campeonatos: "campeonatos",
        equipos: "equipos"
    };

    // Campos para mostrar y filtrar según tipo
    const campos = {
        deportistas: {
            filtro: "categoria",
            titulo: "Nombre",
            camposMostrar: ["nombres", "apellidos", "categoria", "pago"]
        },
        campeonatos: {
            filtro: "categoria",
            titulo: "Nombre",
            camposMostrar: ["nombre", "categoria", "fecha", "estado"]
        },
        equipos: {
            filtro: "categoria",
            titulo: "Nombre",
            camposMostrar: ["nombre", "categoria", "estado"]
        }
    };

    const claveLS = clavesStorage[tipo];
    const filtroClave = campos[tipo].filtro;

    function mostrarItems(filtro = "todas") {
        contenedor.innerHTML = "";
        let items = JSON.parse(localStorage.getItem(claveLS)) || [];

        if (items.length === 0) {
            mensajeNoItems.style.display = "block";
            filtroContainer.innerHTML = "";
            return;
        } else {
            mensajeNoItems.style.display = "none";
            if (!document.getElementById("categoria-select")) {
                // Crear filtro
                const categorias = [...new Set(items.map(i => i[filtroClave]))];
                filtroContainer.innerHTML = `
                    <div class="filter-container">
                        <label for="categoria-select">Filtrar por categoría:</label>
                        <select id="categoria-select" class="filtro-select">
                            <option value="todas">Todas</option>
                            ${categorias.map(cat => `<option value="${cat}">${cat}</option>`).join("")}
                        </select>
                    </div>
                `;
                document.getElementById("categoria-select").addEventListener("change", e => {
                    mostrarItems(e.target.value);
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
            ? items
            : items.filter(i => i[filtroClave] === filtro);

        if (filtrados.length === 0) {
            contenedor.innerHTML = "<p>No hay elementos en esta categoría.</p>";
            return;
        }

        filtrados.forEach((item, idxFiltrado) => {
            // Para poder eliminar por índice en el array original
            // Encontramos el índice en el array original:
            const idxOriginal = items.findIndex(i => JSON.stringify(i) === JSON.stringify(item));
            if (idxOriginal === -1) return;

            // Construir contenido según tipo:
            let contenido = "";
            if (tipo === "deportistas") {
                contenido = `
                    <p><strong>Nombre:</strong> ${item.nombres} ${item.apellidos}</p>
                    <p><strong>Categoría:</strong> ${item.categoria}</p>
                    <p><strong>Estado de Pago:</strong> ${item.pago ? "Al día" : "Pendiente"}</p>
                `;
            } else if (tipo === "campeonatos") {
                contenido = `
                    <p><strong>Nombre:</strong> ${item.nombre}</p>
                    <p><strong>Categoría:</strong> ${item.categoria}</p>
                    <p><strong>Fecha:</strong> ${item.fecha}</p>
                    <p><strong>Estado:</strong> ${item.estado}</p>
                `;
            } else if (tipo === "equipos") {
                contenido = `
                    <p><strong>Nombre:</strong> ${item.nombre}</p>
                    <p><strong>Categoría:</strong> ${item.categoria}</p>
                    <p><strong>Estado:</strong> ${item.estado}</p>
                `;
            }

            const div = document.createElement("div");
            div.classList.add("item");
            div.innerHTML = `
                ${contenido}
                ${
                    modo === "consultar"
                    ? `<button class="btn btn-descargar" data-index="${idxOriginal}">Descargar PDF</button>`
                    : `<button class="btn btn-eliminar" data-index="${idxOriginal}">Eliminar</button>`
                }
            `;
            contenedor.appendChild(div);
        });

        if (modo === "consultar") {
            document.querySelectorAll(".btn-descargar").forEach(btn => {
                btn.addEventListener("click", e => {
                    const idx = parseInt(e.target.getAttribute("data-index"));
                    descargarPDF(idx);
                });
            });
        } else if (modo === "eliminar") {
            document.querySelectorAll(".btn-eliminar").forEach(btn => {
                btn.addEventListener("click", e => {
                    const idx = parseInt(e.target.getAttribute("data-index"));
                    eliminarItem(idx);
                });
            });
        }
    }

    function descargarPDF(idx) {
        // Simple demo: Descargar un PDF con los datos (usa jsPDF si quieres algo más elaborado)
        const items = JSON.parse(localStorage.getItem(claveLS)) || [];
        const item = items[idx];
        if (!item) {
            alert("Elemento no encontrado.");
            return;
        }
        // Aquí podrías usar jsPDF o simplemente abrir un texto nuevo
        // Para demo simple abriremos una ventana con la info
        let contenido = "";
        if (tipo === "deportistas") {
            contenido = `Nombre: ${item.nombres} ${item.apellidos}\nCategoría: ${item.categoria}\nPago: ${item.pago ? "Al día" : "Pendiente"}`;
        } else if (tipo === "campeonatos") {
            contenido = `Nombre: ${item.nombre}\nCategoría: ${item.categoria}\nFecha: ${item.fecha}\nEstado: ${item.estado}`;
        } else if (tipo === "equipos") {
            contenido = `Nombre: ${item.nombre}\nCategoría: ${item.categoria}\nEstado: ${item.estado}`;
        }

        // Abrir en nueva ventana
        const ventana = window.open("", "_blank");
        ventana.document.write(`<pre>${contenido}</pre>`);
        ventana.document.title = `Detalle ${tipo} - ${idx+1}`;
        ventana.document.close();
    }

    function eliminarItem(idx) {
        if (!confirm("¿Seguro que quieres eliminar este elemento?")) return;
        let items = JSON.parse(localStorage.getItem(claveLS)) || [];
        if (idx < 0 || idx >= items.length) {
            alert("Elemento no válido.");
            return;
        }
        items.splice(idx, 1);
        localStorage.setItem(claveLS, JSON.stringify(items));
        mostrarItems();
    }

    mostrarItems();
});
