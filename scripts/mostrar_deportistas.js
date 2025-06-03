document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("lista-items");
  const filtroContainer = document.getElementById("filtro-categorias");
  const mensajeNoItems = document.getElementById("mensaje-no-items");

  contenedor.innerHTML = "<p>Cargando deportistas...</p>";
  try {
    const res = await fetch("http://localhost:3000/deportistas");
    const deportistas = await res.json();

    if (!Array.isArray(deportistas) || deportistas.length === 0) {
      contenedor.innerHTML = "<p>No hay deportistas registrados.</p>";
      if (mensajeNoItems) mensajeNoItems.style.display = "block";
      return;
    }

    // Filtro de categorías
    const categorias = [...new Set(deportistas.map(d => d.categoria))];
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
        ? deportistas
        : deportistas.filter(d => d.categoria === filtro);

      if (filtrados.length === 0) {
        contenedor.innerHTML = "<p>No hay deportistas en esta categoría.</p>";
        return;
      }

      let html = `<table class="tabla-deportistas">
        <thead>
          <tr>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Usuario</th>
            <th>Documento</th>
            <th>Email</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${filtrados.map(d => `
            <tr data-id="${d.id}">
              <td>${d.nombres}</td>
              <td>${d.apellidos}</td>
              <td>${d.usuario}</td>
              <td>${d.documento}</td>
              <td>${d.email}</td>
              <td>${d.categoria.charAt(0).toUpperCase() + d.categoria.slice(1)}</td>
              <td>${d.estado}</td>
              <td>
                ${
                  modo === "consultar"
                    ? `<button class="btn-pdf" title="Descargar PDF" data-id="${d.id}"><i class="fas fa-file-pdf"></i></button>
                       <button class="btn-editar" title="Editar" data-id="${d.id}"><i class="fas fa-edit"></i></button>`
                    : `<button class="btn-eliminar" title="Eliminar" data-id="${d.id}"><i class="fas fa-trash"></i></button>`
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
      const id = e.target.closest("button")?.getAttribute("data-id");
      if (!id) return;

      if (e.target.closest(".btn-pdf")) {
        // Lógica para PDF
        const res = await fetch(`http://localhost:3000/deportistas/${id}`);
        if (!res.ok) return alert("No se pudo obtener la información.");
        const d = await res.json();
        if (window.descargarPDF) {
          window.descargarPDF(
            "Estado de Cuenta - " + d.nombres,
            `<p><strong>Nombre:</strong> ${d.nombres} ${d.apellidos}</p>
             <p><strong>Categoría:</strong> ${d.categoria}</p>
             <p><strong>Estado de Pago:</strong> ${d.pago ? "Al día" : "Pendiente"}</p>`,
            `estado_${d.nombres}_${d.apellidos}.pdf`
          );
        }
      }
      if (e.target.closest(".btn-editar")) {
        if (window.mostrarEditarDeportista) window.mostrarEditarDeportista(id);
      }
      if (e.target.closest(".btn-eliminar")) {
        if (confirm("¿Seguro que deseas eliminar este deportista?")) {
          const res = await fetch(`http://localhost:3000/deportistas/${id}`, { method: "DELETE" });
          if (res.ok) {
            alert("Deportista eliminado correctamente.");
            // Quitar la fila de la tabla
            e.target.closest("tr").remove();
          } else {
            alert("No se pudo eliminar el deportista.");
          }
        }
      }
    });

  } catch (err) {
    contenedor.innerHTML = "<p>Error al cargar los deportistas.</p>";
    console.error(err);
  }
});