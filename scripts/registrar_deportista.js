document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector(".formulario");

  // Limitar fecha nacimiento para que no sea mayor a hoy
  const fechaNacimientoInput = document.getElementById("fecha_nacimiento");
  const hoy = new Date().toISOString().split("T")[0];
  fechaNacimientoInput.setAttribute("max", hoy);

  // Inicializar ID en el campo al cargar
  let base = 40000;
  let id = localStorage.getItem("ultimoIdDeportista");
  id = id ? parseInt(id) + 1 : base;
  document.getElementById("id_deportista").value = id;
  localStorage.setItem("ultimoIdDeportista", id);

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const jugador = {
      id: document.getElementById("id_deportista").value,
      nombres: document.getElementById("nombres").value.trim(),
      apellidos: document.getElementById("apellidos").value.trim(),
      fechaNacimiento: fechaNacimientoInput.value,
      sexo: document.getElementById("sexo").value,
      telefono: document.getElementById("telefono").value.trim(),
      tipoDocumento: document.getElementById("tipo_documento").value,
      documento: document.getElementById("documento").value.trim(),
      email: document.getElementById("email").value.trim(),
      categoria: document.getElementById("categoria").value,
      pago: document.getElementById("pago").checked
    };

    // Validaciones
    if (jugador.nombres.length === 0) {
      alert("Por favor ingresa los nombres.");
      return;
    }

    if (jugador.apellidos.length === 0) {
      alert("Por favor ingresa los apellidos.");
      return;
    }

    if (!jugador.fechaNacimiento) {
      alert("Por favor selecciona la fecha de nacimiento.");
      return;
    }

    if (jugador.fechaNacimiento > hoy) {
      alert("La fecha de nacimiento no puede ser mayor a la fecha actual.");
      return;
    }

    if (!["masculino", "femenino", "otro"].includes(jugador.sexo)) {
      alert("Por favor selecciona un sexo válido.");
      return;
    }

    if (!/^\d{10}$/.test(jugador.telefono)) {
      alert("Número de teléfono inválido. Debe tener exactamente 10 dígitos numéricos.");
      return;
    }

    if (!["CC", "TI", "CE"].includes(jugador.tipoDocumento)) {
      alert("Por favor selecciona un tipo de documento válido.");
      return;
    }

    if (!/^\d+$/.test(jugador.documento)) {
      alert("El número de documento solo debe contener dígitos.");
      return;
    }

    if (!validarEmail(jugador.email)) {
      alert("Correo inválido. Debe contener '@' y no tener espacios.");
      return;
    }

    if (!["benjamin", "mini", "infantil"].includes(jugador.categoria)) {
      alert("Por favor selecciona una categoría válida.");
      return;
    }

    // Guardar en localStorage
    let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
    jugadores.push(jugador);
    localStorage.setItem("jugadores", JSON.stringify(jugadores));

    alert("Jugador registrado correctamente ✅");

    formulario.reset();

    // Generar nuevo ID para el siguiente registro
    let ultimoId = parseInt(localStorage.getItem("ultimoIdDeportista")) || base;
    ultimoId++;
    localStorage.setItem("ultimoIdDeportista", ultimoId);
    document.getElementById("id_deportista").value = ultimoId;
  });

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
