document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');

  // Validar que el correo tenga '@' y no tenga espacios
  if (!email.includes('@') || email.includes(' ')) {
    errorMsg.textContent = "Por favor, introduce un correo electrónico válido.";
    errorMsg.style.color = "red";
    return;
  }

  // Validar dominio permitido
  const dominiosPermitidos = ["gmail.com", "hotmail.com", "unicatolica.edu.co"];
  const partesCorreo = email.split('@');

  if (partesCorreo.length !== 2 || !dominiosPermitidos.includes(partesCorreo[1])) {
    errorMsg.textContent = "Solo se permiten correos de gmail.com, hotmail.com o unicatolica.edu.co.";
    errorMsg.style.color = "red";
    return;
  }

  // Validar que la contraseña no esté vacía
  if (password.trim() === "") {
    errorMsg.textContent = "La contraseña no puede estar vacía.";
    errorMsg.style.color = "red";
    return;
  }

  // Si todo está bien, redirige al menú principal
  window.location.href = "inicio.html";
});

