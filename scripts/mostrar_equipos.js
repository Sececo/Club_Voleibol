document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("lista-items");
  const filtroContainer = document.getElementById("filtro-categorias");
  const mensajeNoItems = document.getElementById("mensaje-no-items");

  function getModo() {
    const params = new URLSearchParams(window.location.search);
    return params.get("modo") || "consultar";
  }
  const modo = getModo();

  contenedor.innerHTML = "<p>Cargando equipos...</p>";
  try {
    const res = await fetch("http://localhost:3000/equipos");
    const equipos = await res.json();

    if (!Array.isArray(equipos) || equipos.length === 0) {
      contenedor.innerHTML = "<p>No hay equipos registrados.</p>";
      if (mensajeNoItems) mensajeNoItems.style.display = "block";
      return;
    }

    // Filtro de categorías
    const categorias = [...new Set(equipos.map(eq => eq.categoria))];
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
        ? equipos
        : equipos.filter(eq => eq.categoria === filtro);

      if (filtrados.length === 0) {
        contenedor.innerHTML = "<p>No hay equipos en esta categoría.</p>";
        return;
      }

      let html = `<table class="tabla-equipos">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Sexo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${filtrados.map(eq => `
            <tr data-id="${eq.id}">
              <td>${eq.nombre}</td>
              <td>${eq.categoria.charAt(0).toUpperCase() + eq.categoria.slice(1)}</td>
              <td>${eq.sexo.charAt(0).toUpperCase() + eq.sexo.slice(1)}</td>
              <td>
                <button class="btn-descargar-equipo" data-id="${eq.id}" title="Descargar PDF">
                  <i class="fas fa-file-pdf"></i>
                </button>
                <button class="btn-asociar" data-id="${eq.id}" data-categoria="${eq.categoria}" title="Asociar Deportistas">
                  <i class="fas fa-users"></i>
                </button>
                <button class="btn-eliminar" data-id="${eq.id}" title="Eliminar">
                  <i class="fas fa-trash"></i>
                </button>
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
      const categoria = btn.getAttribute("data-categoria");
      const sexo = btn.getAttribute("data-sexo");

      // Descargar PDF
      if (btn.classList.contains("btn-descargar") || btn.classList.contains("btn-pdf")) {
        const res = await fetch(`http://localhost:3000/equipos/${id}`);
        if (!res.ok) return alert("No se pudo obtener la información.");
        const eq = await res.json();
        if (window.descargarPDF) {
          window.descargarPDF(
            "Equipo - " + eq.nombre,
            `<p><strong>Nombre:</strong> ${eq.nombre}</p>
             <p><strong>Categoría:</strong> ${eq.categoria}</p>
             <p><strong>Sexo:</strong> ${eq.sexo}</p>`,
            `equipo_${eq.nombre}.pdf`
          );
        }
      }

      // Asociar deportistas
      if (btn.classList.contains("btn-asociar")) {
        if (window.mostrarModalAsociarDeportistas) {
          window.mostrarModalAsociarDeportistas(id, categoria, sexo);
        } else {
          // Si tienes otro método para abrir el modal, llama aquí
          const evento = new CustomEvent("abrirModalAsociar", { detail: { id, categoria, sexo } });
          window.dispatchEvent(evento);
        }
      }

      // Eliminar equipo
      if (btn.classList.contains("btn-eliminar")) {
        if (confirm("¿Seguro que deseas eliminar este equipo?")) {
          const res = await fetch(`http://localhost:3000/equipos/${id}`, { method: "DELETE" });
          if (res.ok) {
            alert("Equipo eliminado correctamente.");
            btn.closest("tr").remove();
          } else {
            alert("No se pudo eliminar el equipo.");
          }
        }
      }
    });

  } catch (err) {
    contenedor.innerHTML = "<p>Error al cargar los equipos.</p>";
    console.error(err);
  }
});