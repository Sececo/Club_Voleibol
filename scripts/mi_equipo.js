document.addEventListener("DOMContentLoaded", function() {
  const deportistas = JSON.parse(localStorage.getItem("deportistas")) || [];
  const equipos = JSON.parse(localStorage.getItem("equipos")) || [];
  const emailGuardado = localStorage.getItem("email");
  const deportista = deportistas.find(dep => dep.email === emailGuardado);

  const infoEquipo = document.getElementById("info-equipo");
  if (!deportista || !deportista.equipo) {
    infoEquipo.textContent = "No tienes equipo asignado.";
    return;
  }

  const equipo = equipos.find(eq => eq.nombre === deportista.equipo);
  if (!equipo) {
    infoEquipo.textContent = "No se encontró información de tu equipo.";
    return;
  }

  let html = `<h2>${equipo.nombre}</h2>`;
  html += `<p>Categoría: ${equipo.categoria || "No especificada"}</p>`;
  html += `<h3>Integrantes:</h3><ul>`;
  if (equipo.integrantes && equipo.integrantes.length > 0) {
    equipo.integrantes.forEach(usuario => {
      html += `<li>${usuario}</li>`;
    });
  } else {
    html += `<li>No hay integrantes registrados.</li>`;
  }
  html += `</ul>`;
  infoEquipo.innerHTML = html;
});