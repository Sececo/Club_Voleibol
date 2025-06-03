document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("lista-items");
  const filtroContainer = document.getElementById("filtro-categorias");
  const mensajeNoItems = document.getElementById("mensaje-no-items");

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

    function getModo() {
      const params = new URLSearchParams(window.location.search);
      return params.get("modo") || "consultar";
    }

    function renderTabla(filtro = "todas") {
      const modo = getModo();
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
                    ? `<button class="btn-asociar" data-id="${c.id}">Asociar equipos</button>`
                    : `<button class="btn-eliminar" data-id="${c.id}">Eliminar</button>`
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
        // Redirige a la página de asociación (debes crearla o enlazarla)
        window.location.href = `asociar_equipos.html?campeonato_id=${id}`;
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