document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');

  // Validar que el correo tenga '@' y no tenga espacios
  if (!email.includes('@') || email.includes(' ')) {
    errorMsg.textContent = "Por favor, introduce un correo electrónico válido.";
    return;
  }

  // Acepta cualquier contraseña, pero puede validar que no esté vacía
  if (password.trim() === "") {
    errorMsg.textContent = "La contraseña no puede estar vacía.";
    return;
  }

  // Si todo está bien, redirige al menú principal
  window.location.href = "principal_page.html";

});
