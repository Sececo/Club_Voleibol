const categoriaSelect = document.getElementById("categoria");
const tablaEquipos = document.getElementById("tabla-equipos").getElementsByTagName("tbody")[0];
const sinEquipos = document.getElementById("sin-equipos");

function mostrarEquipos() {
  const equipos = JSON.parse(localStorage.getItem("equipos")) || [];
  const categoria = categoriaSelect.value;

  // Filtrar equipos por categoría
  const equiposFiltrados = categoria === "" ? equipos : equipos.filter(equipo => equipo.categoria === categoria);

  // Limpiar tabla
  tablaEquipos.innerHTML = "";

  if (equiposFiltrados.length === 0) {
    sinEquipos.style.display = "table-row";
  } else {
    sinEquipos.style.display = "none";
    equiposFiltrados.forEach(equipo => {
      const row = tablaEquipos.insertRow();
      row.innerHTML = `
        <td>${equipo.nombre}</td>
        <td>${equipo.categoria}</td>
        <td>${equipo.jugadores.length}</td>
      `;
    });
  }
}

// Mostrar equipos al cargar y al seleccionar categoría
categoriaSelect.addEventListener("change", mostrarEquipos);
mostrarEquipos();  // Llamar la función para mostrar al cargar la página
