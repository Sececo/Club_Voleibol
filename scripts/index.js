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

// Función para mostrar error debajo del campo
function mostrarError(input, mensaje) {
  eliminarError(input);
  input.classList.add('input-error');
  const error = document.createElement('div');
  error.className = 'input-error-msg';
  error.textContent = mensaje;
  input.parentNode.appendChild(error);
}

// Función para eliminar error
function eliminarError(input) {
  input.classList.remove('input-error');
  const error = input.parentNode.querySelector('.input-error-msg');
  if (error) error.remove();
}

// Validar e iniciar sesión con verificación de usuario registrado
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const emailOrUser = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const recordar = document.querySelector("#cb input").checked;
  const errorMsg = document.getElementById('error-msg');

  // Validar campos vacíos
  if (emailOrUser === "" || password === "") {
    errorMsg.textContent = "Por favor, completa todos los campos.";
    return;
  }

  // Buscar en deportistas (por correo o usuario)
  const deportistas = JSON.parse(localStorage.getItem("deportistas")) || [];
  const deportista = deportistas.find(d =>
    (d.email === emailOrUser || d.usuario === emailOrUser) && d.password === password
  );

  // Si existe como deportista (usuario o correo), permite el login sin validar correo
  if (deportista) {
    localStorage.setItem("email", deportista.email);
    localStorage.setItem("usuario", deportista.usuario);
    window.location.href = "Deportista.html";
    return;
  }

  // Buscar en administradores (solo por correo)
  const administradores = JSON.parse(localStorage.getItem("usuarios")) || [];
  const admin = administradores.find(u => u.email === emailOrUser && u.password === password);

  // Si no es deportista, exige correo válido para admin
  const esCorreoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUser);
  if (!esCorreoValido) {
    errorMsg.textContent = "Ingresa un correo válido.";
    return;
  }

  if (admin) {
    localStorage.setItem("email", admin.email);
    window.location.href = "principal.html";
    return;
  }

  errorMsg.textContent = "Credenciales incorrectas. Intenta de nuevo.";
});