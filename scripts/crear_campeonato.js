document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-campeonato");
  const idInput = document.getElementById("id_campeonato");

  // Función para obtener el siguiente ID disponible
  function getNextId() {
    const campeonatos = JSON.parse(localStorage.getItem("campeonatos")) || [];
    if (campeonatos.length === 0) return 100;
    // Buscar el mayor ID existente y sumar 1
    return Math.max(...campeonatos.map(c => Number(c.id) || 100)) + 1;
  }

  // Mostrar el siguiente ID disponible
  idInput.value = getNextId();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre-campeonato").value.trim();
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const sede = document.getElementById("sede").value.trim();
    const categoria = document.getElementById("categoria").value;

    const soloLetras = /^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/;

    if (!nombre || !fecha || !hora || !sede || !categoria) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    if (!soloLetras.test(nombre) || nombre.length < 3) {
      alert("El nombre del campeonato debe tener mínimo 3 letras, iniciar cada palabra con mayúscula y contener solo letras y espacios.");
      return;
    }
    if (!soloLetras.test(sede) || sede.length < 3) {
      alert("La sede debe tener mínimo 3 letras, iniciar cada palabra con mayúscula y contener solo letras y espacios.");
      return;
    }

    const hoy = new Date();
    const fechaInicio = new Date(fecha);
    hoy.setHours(0, 0, 0, 0);

    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    const maxFecha = new Date(hoy);
    maxFecha.setMonth(maxFecha.getMonth() + 6);

    if (fechaInicio < mañana) {
      alert("La fecha debe ser al menos a partir de mañana.");
      return;
    }
    if (fechaInicio > maxFecha) {
      alert("La fecha no puede ser mayor a 6 meses desde hoy.");
      return;
    }

    if (!/^\d{2}:\d{2}$/.test(hora)) {
      alert("La hora debe tener el formato HH:MM.");
      return;
    }
    const [horaInicio, minutos] = hora.split(":").map(Number);
    if (
      isNaN(horaInicio) || isNaN(minutos) ||
      horaInicio < 8 || horaInicio > 20 ||
      minutos < 0 || minutos > 59
    ) {
      alert("La hora debe estar entre las 08:00 y 20:00, y los minutos entre 00 y 59.");
      return;
    }

    const campeonatos = JSON.parse(localStorage.getItem("campeonatos")) || [];
    const existe = campeonatos.some(c =>
      c.nombre.toLowerCase() === nombre.toLowerCase() &&
      c.fecha === fecha
    );
    if (existe) {
      alert("Ya existe un campeonato con ese nombre y fecha.");
      return;
    }

    // Obtener el ID actual del input (siempre el siguiente disponible)
    const id = idInput.value;

    // Si todo es válido, guardar
    const campeonato = {
      id,
      nombre,
      fecha,
      hora,
      sede,
      categoria,
      estado: 'activo'
    };

    console.log("Guardando campeonato:", campeonato); // <-- Depuración

    campeonatos.push(campeonato);
    localStorage.setItem("campeonatos", JSON.stringify(campeonatos));

    alert("Campeonato creado exitosamente:\n" + JSON.stringify(campeonato, null, 2));
    form.reset();

    // Mostrar el siguiente ID disponible después de guardar
    idInput.value = getNextId();
  });
});
