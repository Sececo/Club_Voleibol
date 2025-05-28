// Mostrar modal al hacer clic en "Registrarme"
document.getElementById('registroLink').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('modalRegistro').style.display = 'flex';
});

// Redirección según tipo de registro
function redirigirRegistro(tipo) {
  window.location.href = "usuario.html";
}

// Cierra el modal al hacer clic fuera del contenido
window.onclick = function(event) {
  const modal = document.getElementById('modalRegistro');
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Cargar datos si están guardados (Recordarme)
window.addEventListener("DOMContentLoaded", () => {
  const savedEmail = localStorage.getItem("email");
  const savedPassword = localStorage.getItem("password");
  if (savedEmail && savedPassword) {
    document.getElementById("email").value = savedEmail;
    document.getElementById("password").value = savedPassword;
    document.querySelector("#cb input").checked = true;
  }
});

// Validar e iniciar sesión con verificación de usuario registrado
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const recordar = document.querySelector("#cb input").checked;
  const errorMsg = document.getElementById('error-msg');

  // Validación del correo
  if (!email.includes('@') || email.includes(' ')) {
    errorMsg.textContent = "Por favor, introduce un correo electrónico válido.";
    return;
  }

  // Validación de contraseña vacía
  if (password.trim() === "") {
    errorMsg.textContent = "La contraseña no puede estar vacía.";
    return;
  }

  // Verificar si el usuario está registrado
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioEncontrado = usuarios.find(usuario => usuario.email === email && usuario.password === password);

  if (!usuarioEncontrado) {
    errorMsg.textContent = "Debes registrarte primero para poder iniciar sesión.";
    return;
  }

  // Guardar en localStorage si se seleccionó "Recordarme"
  if (recordar) {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
  } else {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
  }

  // Redirige a la página de inicio
  window.location.href = "inicio.html";
});