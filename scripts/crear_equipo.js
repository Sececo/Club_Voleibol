const jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
const form = document.getElementById("form-equipo");
const categoriaEquipo = document.getElementById("categoria-equipo");
const jugadoresContainer = document.getElementById("jugadores-container");
const botonVerJugadores = document.getElementById("ver-jugadores");

// Función para mostrar los jugadores disponibles
function mostrarJugadoresDisponibles() {
  const categoriaSeleccionada = categoriaEquipo.value;
  const jugadoresDisponibles = jugadores.filter(jugador => 
    jugador.categoria === categoriaSeleccionada && jugador.pago === true
  );

  jugadoresContainer.innerHTML = ""; // Limpiar el contenedor de jugadores

  if (jugadoresDisponibles.length === 0) {
    jugadoresContainer.innerHTML = "<p>No hay jugadores disponibles en esta categoría.</p>";
    return;
  }

  jugadoresDisponibles.forEach(jugador => {
    const divJugador = document.createElement("div");
    divJugador.classList.add("jugador");
    divJugador.innerHTML = `
      <p><strong>Nombre:</strong> ${jugador.nombres} ${jugador.apellidos}</p>
    `;
    jugadoresContainer.appendChild(divJugador);
  });

  if (jugadoresDisponibles.length < 9) {
    alert("No hay suficientes jugadores disponibles (se requieren al menos 9 jugadores).");
  }
}

// Función para validar si hay al menos 9 jugadores disponibles
function validarJugadores() {
  const categoriaSeleccionada = categoriaEquipo.value;
  const jugadoresDisponibles = jugadores.filter(jugador => 
    jugador.categoria === categoriaSeleccionada && jugador.pago === true
  );

  if (jugadoresDisponibles.length < 9) {
    alert("Debe haber al menos 9 jugadores disponibles al día para crear un equipo.");
    return false;
  }

  return true;
}

// Evento para mostrar los jugadores cuando se haga clic en el botón
botonVerJugadores.addEventListener("click", mostrarJugadoresDisponibles);

// Evento para crear el equipo
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validarJugadores()) return;

  const nombreEquipo = document.getElementById("nombre-equipo").value;
  const categoriaEquipoValue = categoriaEquipo.value;

  // Aquí se guarda el equipo creado en localStorage
  const equipo = {
    nombre: nombreEquipo,
    categoria: categoriaEquipoValue,
    jugadores: [] // Se agregarán los jugadores seleccionados posteriormente
  };

  let equipos = JSON.parse(localStorage.getItem("equipos")) || [];
  equipos.push(equipo);
  localStorage.setItem("equipos", JSON.stringify(equipos));

  alert("Equipo creado exitosamente.");
  form.reset();
  jugadoresContainer.innerHTML = ""; // Limpiar los jugadores mostrados
});

