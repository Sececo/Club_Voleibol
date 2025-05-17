document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector(".formulario");

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const jugador = {
      nombres: document.getElementById("nombres").value.trim(),
      apellidos: document.getElementById("apellidos").value.trim(),
      fechaNacimiento: document.getElementById("fecha_nacimiento").value,
      sexo: document.getElementById("sexo").value,
      telefono: document.getElementById("telefono").value,
      tipoDocumento: document.getElementById("tipo_documento").value,
      documento: document.getElementById("documento").value,
      email: document.getElementById("email").value.trim(),
      categoria: document.getElementById("categoria").value,
      pago: document.getElementById("pago").checked
    };

    // Validaciones extra
    if (!validarEmail(jugador.email)) {
      alert("Correo inválido. Debe contener '@' y no tener espacios.");
      return;
    }

    if (jugador.telefono.length !== 10 || isNaN(jugador.telefono)) {
      alert("Número de teléfono inválido. Debe tener 10 dígitos.");
      return;
    }

    if (!/^[0-9]+$/.test(jugador.documento)) {
      alert("El número de documento solo debe contener dígitos.");
      return;
    }

    // Guardar en localStorage
    let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
    jugadores.push(jugador);
    localStorage.setItem("jugadores", JSON.stringify(jugadores));

    alert("Jugador registrado correctamente ✅");

    formulario.reset(); // Limpia el formulario
  });

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
