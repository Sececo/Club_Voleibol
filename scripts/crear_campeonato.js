document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-campeonato");
  const idInput = document.getElementById("id_campeonato");

  // Generar ID automático
  let base = 100;
  let id = localStorage.getItem("ultimoIdCampeonato");
  id = id ? parseInt(id) + 1 : base;
  idInput.value = id;
  localStorage.setItem("ultimoIdCampeonato", id);

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre-campeonato").value.trim();
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const sede = document.getElementById("sede").value.trim();
    const categoria = document.getElementById("categoria").value;

    // Expresión regular para letras y espacios
    const soloLetras = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ\s]*$/;

    // Validaciones básicas
    if (!nombre || !fecha || !hora || !sede || !categoria) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    // Validar nombre y sede
    if (!soloLetras.test(nombre)) {
      alert("El nombre del campeonato debe comenzar en mayúscula y contener solo letras y espacios.");
      return;
    }

    if (!soloLetras.test(sede)) {
      alert("La sede debe comenzar en mayúscula y contener solo letras y espacios.");
      return;
    }

    // Validar fecha: mínimo mañana, máximo 6 meses
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

    // Validar hora entre 08:00 y 20:00
    const horaInicio = parseInt(hora.split(":")[0]);
    if (horaInicio < 8 || horaInicio > 20) {
      alert("La hora debe estar entre las 08:00 y 20:00.");
      return;
    }

    // Si todo es válido, guardar
    const campeonato = {
      id,
      nombre,
      fecha,
      hora,
      sede,
      categoria,
    };

    // Obtener campeonatos previos
    const campeonatos = JSON.parse(localStorage.getItem("campeonatos")) || [];
    campeonatos.push(campeonato);
    localStorage.setItem("campeonatos", JSON.stringify(campeonatos));

    alert("Campeonato creado exitosamente.");
    form.reset();

    // Actualizar ID para el siguiente
    id++;
    idInput.value = id;
    localStorage.setItem("ultimoIdCampeonato", id);
  });
});
