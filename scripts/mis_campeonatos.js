document.addEventListener("DOMContentLoaded", function() {
  const deportistas = JSON.parse(localStorage.getItem("deportistas")) || [];
  const equipos = JSON.parse(localStorage.getItem("equipos")) || [];
  const campeonatos = JSON.parse(localStorage.getItem("campeonatos")) || [];
  const emailGuardado = localStorage.getItem("email");
  const deportista = deportistas.find(dep => dep.email === emailGuardado);

  const lista = document.getElementById("lista-campeonatos");
  lista.innerHTML = "";

  if (!deportista) {
    lista.textContent = "No se encontró información del deportista.";
    return;
  }

  let equipoNombre = deportista.equipo;
  if (!equipoNombre && equipos.length > 0) {
    const equipo = equipos.find(eq => eq.integrantes && eq.integrantes.includes(deportista.usuario));
    if (equipo) equipoNombre = equipo.nombre;
  }

  const campeonatosInscrito = campeonatos.filter(camp =>
    camp.equiposAsociados && camp.equiposAsociados.includes(equipoNombre)
  );

  if (campeonatosInscrito.length === 0) {
    lista.textContent = "No estás inscrito en ningún campeonato.";
  } else {
    const ul = document.createElement("ul");
    campeonatosInscrito.forEach(camp => {
      const li = document.createElement("li");
      li.textContent = camp.nombre + (camp.categoria ? " - " + camp.categoria : "");
      ul.appendChild(li);
    });
    lista.appendChild(ul);
  }
});