document.addEventListener("DOMContentLoaded", function () {
  let num1 = Math.floor(Math.random() * 10) + 1;
  let num2 = Math.floor(Math.random() * 10) + 1;
  let operador = Math.random() < 0.5 ? '+' : '-';
  let resultado = operador === '+' ? num1 + num2 : num1 - num2;
  let intentosFallidos = 0;
  let bloqueoActivo = false;
  let tiempoRestante = 120; // 2 minutos en segundos

  document.getElementById("operation").innerText = `¿Cuánto es ${num1} ${operador} ${num2}?`;

  window.validarYRedirigir = function (event) {
    event.preventDefault();

    if (bloqueoActivo) {
      return;
    }

    let respuestaUsuario = parseInt(document.getElementById("respuesta").value, 10);
    
    if (respuestaUsuario === resultado) {
      window.location.href = "Ncontraseña.html"; // Redirige a la página de restablecimiento de contraseña
    } else {
      intentosFallidos++;
      document.getElementById("error-msg").innerText = `Respuesta incorrecta. Intento ${intentosFallidos} de 5.`;

      if (intentosFallidos >= 5) {
        bloqueoActivo = true;
        document.getElementById("error-msg").innerText = `Acceso bloqueado por 02:00 minutos.`;
        document.getElementById("respuesta").disabled = true;
        document.querySelector("button[type='submit']").disabled = true;

        let intervalo = setInterval(() => {
          tiempoRestante--;
          let minutos = Math.floor(tiempoRestante / 60);
          let segundos = tiempoRestante % 60;
          let tiempoFormateado = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
          
          document.getElementById("error-msg").innerText = `Acceso bloqueado. Espera ${tiempoFormateado} minutos para intentarlo de nuevo.`;

          if (tiempoRestante <= 0) {
            clearInterval(intervalo);
            bloqueoActivo = false;
            intentosFallidos = 0;
            tiempoRestante = 120; // Reinicia el contador
            document.getElementById("error-msg").innerText = "";
            document.getElementById("respuesta").disabled = false;
            document.querySelector("button[type='submit']").disabled = false;
          }
        }, 1000);
      }
    }
  };

  window.validarLongitud = function (inputId, msgId) {
    let input = document.getElementById(inputId);
    let mensaje = document.getElementById(msgId);

    if (input.value.length < 8) {
      mensaje.innerText = "Debe ingresar mínimo 8 caracteres.";
    } else {
      mensaje.innerText = "";
    }
  };

  window.validarContraseña = function (event) {
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

    window.location.href = "index.html"; // Redirige a index.html tras validación exitosa
  };
});