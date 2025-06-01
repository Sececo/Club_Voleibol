    // --- FUNCIÓN PRINCIPAL: MOSTRAR ITEMS ---
    /**
     * Muestra los elementos en pantalla, con opción de filtrar por categoría.
     * Si el modo es "eliminar", muestra botón para eliminar.
     * Si el modo es "consultar", muestra botón para descargar PDF.
     */

import { tipoyModo }  from "/scripts/Gestiones.js";
    const { tipo, modo } = tipoyModo();
import { eliminarItem } from "./eliminar_item.js";
import  { descargarPDF }  from "/scripts/descargarPDF.js";

console.log("Tipo:", tipo);
console.log("Modo:", modo);
    

// --- INICIALIZACIÓN Y CONFIGURACIÓN ---
(async function mostrarItems(filtro="todas") {

    const contenedor = document.getElementById("lista-items");
    const mensajeNoItems = document.getElementById("mensaje-no-items");
    const filtroContainer = document.getElementById("filtro-categorias");

    // Claves en localStorage según tipo
    const clavesStorage = {
        deportistas: "jugadores",
        campeonatos: "campeonatos",
        equipos: "equipos"
    };

    console.log("Clave de localStorage:", clavesStorage[tipo]);
    console.log("Filtro clave:", clavesStorage[tipo]);  


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

    console.log("Campos a mostrar:", campos[tipo].camposMostrar);
    console.log("Filtro clave:", campos[tipo].filtro);

const claveLS = clavesStorage[tipo];
const filtroClave = campos[tipo].filtro;

console.log("Clave de localStorage:", claveLS);
console.log("Filtro clave:", filtroClave);





console.log("hola mundo"),

    console.log("Mostrando items con filtro:", filtro);
    contenedor.innerHTML = "";
    let items = JSON.parse(localStorage.getItem(claveLS)) || [];

        // Si no hay elementos, mostrar mensaje y salir
        if (items.length === 0) {
            mensajeNoItems.style.display = "block";
            filtroContainer.innerHTML = "";
            return;
        } else {
            mensajeNoItems.style.display = "none";
            // Crear filtro de categorías si no existe
            if (!document.getElementById("categoria-select")) {
                const categorias = [...new Set(items.map(i => i[filtroClave]))];
                filtroContainer.innerHTML = `
                    <div class="filter-container">
                        <label for="categoria-select">Filtrar por categoría:</label>
                        <select id="categoria-select" class="filtro-select">
                            <option value="todas">Selecciona</option>
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

            // Actualizar valor del filtro si cambió
            const categoriaSelect = document.getElementById("categoria-select");
            if (categoriaSelect && categoriaSelect.value !== filtro) {
                categoriaSelect.value = filtro;
                }
            }

        // Filtrar elementos según categoría seleccionada
        const filtrados = filtro === "todas"
            ? items
            : items.filter(i => i[filtroClave] === filtro);

        // Si no hay elementos en la categoría, mostrar mensaje
        if (filtrados.length === 0) {
            contenedor.innerHTML = "<p>No hay elementos en esta categoría.</p>";
            return;
        }

        // Mostrar cada elemento
        filtrados.forEach((item, idxFiltrado) => {
            // Buscar índice real en el array original
            const idxOriginal = items.findIndex(i => JSON.stringify(i) === JSON.stringify(item));
            if (idxOriginal === -1) return;

            // Construir contenido según tipo
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

            // Crear div para el elemento
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

        // Asignar eventos a los botones según el modo
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
    })();
        
console.log("Mostrando items...");
// Llamar a la función al cargar el documento  
// Esperar a que mostrarItems esté definida antes de llamarl

