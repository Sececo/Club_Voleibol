// --- FUNCIÓN PRINCIPAL: MOSTRAR ITEMS ---
/**
 * Muestra los elementos en pantalla, con opción de filtrar por categoría.
 * Si el modo es "eliminar", muestra botón para eliminar.
 * Si el modo es "consultar", muestra botón para descargar PDF.
 */

import { eliminarItem } from "./eliminar_item.js";
import { descargarPDF }  from "./descargarPDF.js";
import { editarDeportista } from "./editar_deportista.js";

const { tipo, modo } = tipoyModo();

console.log("Tipo:", tipo);
console.log("Modo:", modo);
    

// --- INICIALIZACIÓN Y CONFIGURACIÓN ---
export async function mostrarItems(filtro = "todas") {
    const contenedor = document.getElementById("lista-items");
    const mensajeNoItems = document.getElementById("mensaje-no-items");
    const filtroContainer = document.getElementById("filtro-categorias");

    // Define las rutas de la API según el tipo
    const rutasAPI = {
        deportistas: "http://localhost:3000/deportistas",
        campeonatos: "http://localhost:3000/campeonatos",
        equipos: "http://localhost:3000/equipos"
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

    // Obtén los datos desde el backend
    let items = [];
    try {
        const res = await fetch(rutasAPI[tipo]);
        items = await res.json();
    } catch (err) {
        contenedor.innerHTML = "<p>Error al cargar los datos.</p>";
        return;
    }

    console.log("Deportistas recibidos:", items);

    // Filtrar elementos según categoría seleccionada
    const filtroClave = campos[tipo].filtro; // "categoria"
    const filtrados = filtro === "todas"
        ? items
        : items.filter(i => i[filtroClave] === filtro);

    // Si no hay elementos en la categoría, mostrar mensaje
    if (filtrados.length === 0) {
        contenedor.innerHTML = "<p>No hay elementos en esta categoría.</p>";
        return;
    }

    // Limpiar contenedor antes de renderizar
    contenedor.innerHTML = "";

    // Mostrar cada elemento
    filtrados.forEach((item) => {
        let contenido = "";
        if (tipo === "deportistas") {
            contenido = `
                <container class="containerjs">
                    <p><strong>Nombre:</strong> ${item.nombres} ${item.apellidos}</p>
                    <p><strong>Categoría:</strong> ${item.categoria}</p>
                    <p><strong>Estado de Pago:</strong> ${item.pago ? "Al día" : "Pendiente"}</p>
                </container>
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

        // Botones para deportistas en modo consultar
        if (modo === "consultar" && tipo === "deportistas") {
            div.innerHTML = `
                ${contenido}
                <button class="btn btn-descargar" data-id="${item.id}"><i class="fas fa-file-pdf"></i> PDF</button>
                <button class="btn btn-editar" type="button" data-id="${item.id}"><i class="fas fa-edit"></i> Editar</button>
                <button class="btn btn-eliminar" data-id="${item.id}"><i class="fas fa-trash"></i> Eliminar</button>
            `;
        } else if (modo === "consultar" && tipo === "campeonatos") {
            div.innerHTML = `
                ${contenido}
                <button class="btn btn-descargar" data-id="${item.id}">Descargar PDF</button>
                <button class="btn btn-asociar" type="button" data-id="${item.id}">Asociar equipos</button>
            `;
        } else if (modo === "consultar") {
            div.innerHTML = `
                ${contenido}
                <button class="btn btn-descargar" data-id="${item.id}">Descargar PDF</button>
            `;
        } else {
            div.innerHTML = `
                ${contenido}
                <button class="btn btn-eliminar" data-id="${item.id}">Eliminar</button>
            `;
        }
        contenedor.appendChild(div);
    });

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
                        <option value="todas">Todas</option>
                        ${categorias.map(cat => {
                            let texto = cat.charAt(0).toUpperCase() + cat.slice(1);
                            if (cat === "benjamin") texto = "Benjamín";
                            return `<option value="${cat}">${texto}</option>`;
                        }).join("")}
                    </select>
                </div>
            `;
            document.getElementById("categoria-select").addEventListener("change", e => {
                mostrarItems(e.target.value);
            });
            const urlParams = new URLSearchParams(window.location.search);
            const currentFilter = urlParams.get("filtroCategoria") || "todas";
            document.getElementById("categoria-select").value = currentFilter;
        }

        // Actualizar valor del filtro si cambió
        const categoriaSelect = document.getElementById("categoria-select");
        if (categoriaSelect && categoriaSelect.value !== filtro) {
            categoriaSelect.value = filtro;
        }
    }

    // Asignar eventos a los botones según el modo
    if (modo === "consultar") {
        document.querySelectorAll(".btn-descargar").forEach(btn => {
            btn.addEventListener("click", async e => {
                const id = e.target.getAttribute("data-id");
                // Obtener el item desde el backend por ID
                let itemData = null;
                if (tipo === "deportistas") {
                    const res = await fetch(`http://localhost:3000/deportistas/${id}`);
                    if (!res.ok) return alert("No se pudo obtener la información.");
                    itemData = await res.json();
                    const contenido = `
                        <p><strong>Nombre:</strong> ${itemData.nombres} ${itemData.apellidos}</p>
                        <p><strong>Categoría:</strong> ${itemData.categoria}</p>
                        <p><strong>Estado de Pago:</strong> ${itemData.pago ? "Al día" : "Pendiente"}</p>
                    `;
                    descargarPDF("Nombre - " + itemData.nombres, contenido, `estado_${itemData.nombres}_${itemData.apellidos}.pdf`);
                } else if (tipo === "campeonatos") {
                    const res = await fetch(`http://localhost:3000/campeonatos/${id}`);
                    if (!res.ok) return alert("No se pudo obtener la información.");
                    itemData = await res.json();
                    const contenido = `
                        <p><strong>Nombre:</strong> ${itemData.nombre}</p>
                        <p><strong>Categoría:</strong> ${itemData.categoria}</p>
                        <p><strong>Fecha:</strong> ${itemData.fecha}</p>
                        <p><strong>Estado:</strong> ${itemData.estado}</p>
                    `;
                    descargarPDF("Campeonato - " + itemData.nombre, contenido, `campeonato_${itemData.nombre}.pdf`);
                } else if (tipo === "equipos") {
                    const res = await fetch(`http://localhost:3000/equipos/${id}`);
                    if (!res.ok) return alert("No se pudo obtener la información.");
                    itemData = await res.json();
                    const contenido = `
                        <p><strong>Nombre:</strong> ${itemData.nombre}</p>
                        <p><strong>Categoría:</strong> ${itemData.categoria}</p>
                        <p><strong>Estado:</strong> ${itemData.estado}</p>
                    `;
                    descargarPDF("Equipo - " + itemData.nombre, contenido, `equipo_${itemData.nombre}.pdf`);
                }
            });
        });
        if (tipo === "campeonatos") {
            document.querySelectorAll(".btn-asociar").forEach(btn => {
                btn.addEventListener("click", e => {
                    const id = e.target.getAttribute("data-id");
                    window.mostrarAsociarEquipos(id);
                });
            });
        }
        document.querySelectorAll(".btn-editar").forEach(btn => {
            btn.addEventListener("click", e => {
                // El evento onclick ya está en el HTML, pero puedes agregar lógica aquí si lo necesitas
            });
        });
    } else if (modo === "eliminar") {
        document.querySelectorAll(".btn-eliminar").forEach(btn => {
            btn.addEventListener("click", e => {
                const id = e.target.getAttribute("data-id");
                eliminarItem(id, tipo, () => mostrarItems(document.getElementById("categoria-select")?.value || "todas"));
            });
        });
    }
}

// Mostrar campeonatos desde la base de datos
async function mostrarCampeonatos() {
  const contenedor = document.getElementById("lista-items");
  const mensajeNoItems = document.getElementById("mensaje-no-items");
  let campeonatos = [];
  try {
    const res = await fetch("http://localhost:3000/campeonatos");
    campeonatos = await res.json();
  } catch {
    contenedor.innerHTML = "<p>Error al cargar los datos.</p>";
    return;
  }
  if (campeonatos.length === 0) {
    mensajeNoItems.style.display = "block";
    contenedor.innerHTML = "";
    return;
  }
  mensajeNoItems.style.display = "none";
  contenedor.innerHTML = "";
  campeonatos.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = `
      <p><strong>Nombre:</strong> ${item.nombre}</p>
      <p><strong>Categoría:</strong> ${item.categoria}</p>
      <p><strong>Fecha:</strong> ${item.fecha}</p>
      <p><strong>Estado:</strong> ${item.estado}</p>
    `;
    contenedor.appendChild(div);
  });
}
document.addEventListener("DOMContentLoaded", mostrarCampeonatos);
document.addEventListener("DOMContentLoaded", () => mostrarItems());

window.mostrarItems = mostrarItems; // Para poder llamarla desde otros scripts

// Llamar a la función al cargar el documento  
document.addEventListener("DOMContentLoaded", () => mostrarItems());

console.log("Mostrando items...");
// Llamar a la función al cargar el documento  
// Esperar a que mostrarItems esté definida antes de llamarl

