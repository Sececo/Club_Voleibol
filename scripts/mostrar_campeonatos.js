document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("lista-items");
  const filtroContainer = document.getElementById("filtro-categorias");
  const mensajeNoItems = document.getElementById("mensaje-no-items");

  function getModo() {
    const params = new URLSearchParams(window.location.search);
    return params.get("modo") || "consultar";
  }
  const modo = getModo();

  contenedor.innerHTML = "<p>Cargando campeonatos...</p>";
  try {
    const res = await fetch("http://localhost:3000/campeonatos");
    const campeonatos = await res.json();

    if (!Array.isArray(campeonatos) || campeonatos.length === 0) {
      contenedor.innerHTML = "<p>No hay campeonatos registrados.</p>";
      if (mensajeNoItems) mensajeNoItems.style.display = "block";
      return;
    }

    // Filtro de categorías
    const categorias = [...new Set(campeonatos.map(c => c.categoria))];
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

    function renderTabla(filtro = "todas") {
      const filtrados = filtro === "todas"
        ? campeonatos
        : campeonatos.filter(c => c.categoria === filtro);

      if (filtrados.length === 0) {
        contenedor.innerHTML = "<p>No hay campeonatos en esta categoría.</p>";
        return;
      }

      let html = `<table class="tabla-campeonatos">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Sede</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${filtrados.map(c => `
            <tr data-id="${c.id}">
              <td>${c.nombre}</td>
              <td>${c.categoria.charAt(0).toUpperCase() + c.categoria.slice(1)}</td>
              <td>${c.fecha}</td>
              <td>${c.hora.slice(0,5)}</td>
              <td>${c.sede}</td>
              <td>
                ${
                  modo === "consultar"
                    ? `
                      <button class="btn-asociar" title="Asociar equipos" data-id="${c.id}" data-categoria="${c.categoria}">
                        <i class="fas fa-users"></i>
                      </button>
                      <button class="btn-descargar" title="Descargar PDF" data-id="${c.id}">
                        <i class="fas fa-file-pdf"></i>
                      </button>
                    `
                    : `<button class="btn-eliminar" title="Eliminar" data-id="${c.id}">
                        <i class="fas fa-trash"></i>
                      </button>`
                }
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>`;
      contenedor.innerHTML = html;
    }

    renderTabla();

    document.getElementById("categoria-select").addEventListener("change", e => {
      renderTabla(e.target.value);
    });

    // Delegación de eventos para los botones
    contenedor.addEventListener("click", async e => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const id = btn.getAttribute("data-id");

      if (btn.classList.contains("btn-asociar")) {
        // Para equipos
        if (window.mostrarModalAsociarDeportistas) {
          window.mostrarModalAsociarDeportistas(id, categoria, sexo);
        }
        // Para campeonatos
        // ... similar, abre el modal y carga los equipos ...
      }
      if (btn.classList.contains("btn-descargar")) {
        // Trae el campeonato
        const res = await fetch(`http://localhost:3000/campeonatos/${id}`);
        if (!res.ok) return alert("No se pudo obtener la información.");
        const camp = await res.json();

        // Trae equipos asociados
        const resAsoc = await fetch(`http://localhost:3000/campeonato_equipo`);
        const asociaciones = await resAsoc.json();
        const equiposIds = asociaciones.filter(a => a.campeonato_id == id).map(a => a.equipo_id);

        let equiposHtml = "";
        if (equiposIds.length) {
          const resEq = await fetch(`http://localhost:3000/equipos`);
          const todos = await resEq.json();
          equiposHtml = todos
            .filter(eq => equiposIds.includes(eq.id))
            .map(eq => `<li>${eq.nombre} (${eq.categoria}, ${eq.sexo})</li>`)
            .join("");
        }

        if (window.descargarPDF) {
          window.descargarPDF(
            "Campeonato - " + camp.nombre,
            `<p><strong>Nombre:</strong> ${camp.nombre}</p>
             <p><strong>Categoría:</strong> ${camp.categoria}</p>
             <p><strong>Fecha:</strong> ${camp.fecha}</p>
             <p><strong>Hora:</strong> ${camp.hora}</p>
             <p><strong>Sede:</strong> ${camp.sede}</p>
             <hr>
             <b>Equipos Asociados:</b>
             <ul>${equiposHtml || "<i>Sin equipos asociados</i>"}</ul>`,
            `campeonato_${camp.nombre}.pdf`
          );
        }
      }
      if (btn.classList.contains("btn-eliminar")) {
        if (confirm("¿Seguro que deseas eliminar este campeonato?")) {
          const res = await fetch(`http://localhost:3000/campeonatos/${id}`, { method: "DELETE" });
          if (res.ok) {
            alert("Campeonato eliminado correctamente.");
            btn.closest("tr").remove();
          } else {
            alert("No se pudo eliminar el campeonato.");
          }
        }
      }
    });

  } catch (err) {
    contenedor.innerHTML = "<p>Error al cargar los campeonatos.</p>";
    console.error(err);
  }
});

// --- MODAL ASOCIAR EQUIPOS ---
const modal = document.getElementById('modal-asociar-equipos');
const cerrarModal = document.getElementById('cerrar-modal-asociar-equipos');
let campeonatoSeleccionado = null;
let categoriaSeleccionada = null;

cerrarModal.onclick = () => { modal.style.display = 'none'; };
modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

// Asociar equipos seleccionados
document.getElementById('form-asociar-equipos').onsubmit = async function(e) {
  e.preventDefault();
  const seleccionados = Array.from(document.querySelectorAll('input[name="equipos"]:checked')).map(cb => cb.value);
  if (!seleccionados.length) return alert('Selecciona al menos un equipo.');
  const res = await fetch('http://localhost:3000/campeonato_equipo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ campeonato_id: campeonatoSeleccionado, equipos: seleccionados })
  });
  if (res.ok) {
    alert('Equipos asociados correctamente.');
    modal.style.display = 'none';
  } else {
    alert('Error al asociar equipos.');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('lista-items');
  contenedor.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-asociar');
    if (btn) {
      const id = btn.getAttribute('data-id');
      const categoria = btn.getAttribute('data-categoria');
      if (window.mostrarModalAsociarEquipos) {
        window.mostrarModalAsociarEquipos(id, categoria);
      }
    }
  });
});

function renderTablaCampeonatos(lista) {
  let html = "<table><thead>...</thead><tbody>";
  lista.forEach(c => {
    html += `
      <tr>
        <td>${c.nombre}</td>
        <td>${c.categoria}</td>
        <td>${c.fecha}</td>
        <td>${c.hora}</td>
        <td>${c.sede}</td>
        <td>
          <button class="btn-descargar-campeonato" data-id="${c.id}" title="Descargar PDF">
            <i class="fas fa-file-pdf"></i>
          </button>
          <button class="btn-asociar" data-id="${c.id}" data-categoria="${c.categoria}" title="Asociar Equipos">
            <i class="fas fa-users"></i>
          </button>
          <button class="btn-eliminar" data-id="${c.id}" title="Eliminar">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
  html += "</tbody></table>";
  document.getElementById("lista-items").innerHTML = html;
}