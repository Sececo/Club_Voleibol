document.addEventListener("DOMContentLoaded", function () {
  // Validación de la longitud de la contraseña
  window.validarLongitud = function (inputId, msgId) {
    let input = document.getElementById(inputId);
    let mensaje = document.getElementById(msgId);

    if (input.value.length < 8) {
      mensaje.innerText = "Debe ingresar mínimo 8 caracteres.";
    } else {
      mensaje.innerText = "";
    }
  };

  // Validación de la contraseña y redirección
  window.validarYRedirigir = function (event) {
    event.preventDefault();

    let nuevaContraseña = document.getElementById("new-password").value;
    let confirmarContraseña = document.getElementById("confirm-password").value;
    let mensajeError = document.getElementById("error-msg");

    if (nuevaContraseña.length < 8 || confirmarContraseña.length < 8) {
      mensajeError.innerText = "La contraseña debe tener al menos 8 caracteres.";
      return;
    }

    if (nuevaContraseña !== confirmarContraseña) {
      mensajeError.innerText = "Las contraseñas no coinciden.";
      return;
    }

    // Redirigir a index.html tras una validación exitosa
    window.location.href = "index.html";
  };

  // Generación de operación matemática para validación
  let num1 = Math.floor(Math.random() * 10) + 1;
  let num2 = Math.floor(Math.random() * 10) + 1;
  let operador = Math.random() < 0.5 ? '+' : '-';
  let resultado = operador === '+' ? num1 + num2 : num1 - num2;

  document.getElementById("operation").innerText = `¿Cuánto es ${num1} ${operador} ${num2}?`;

  window.validarOperacion = function (event) {
    event.preventDefault();
    let respuestaUsuario = parseInt(document.getElementById("respuesta").value, 10);

    if (respuestaUsuario === resultado) {
      window.location.href = "Ncontraseña.html"; // Redirige a la página de restablecimiento de contraseña
    } else {
      document.getElementById("error-msg").innerText = "Respuesta incorrecta. Inténtalo de nuevo.";
    }
  };
});