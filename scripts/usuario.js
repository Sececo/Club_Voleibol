// Validar longitud de contraseña en tiempo real
document.getElementById('confirm-password').addEventListener('input', function() {
  const msg = document.getElementById('msg-confirm-password');
  if (this.value.length < 8) {
    msg.textContent = "La contraseña debe tener mínimo 8 caracteres.";
  } else {
    msg.textContent = "";
  }
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('new-password').value.trim();
  const password = document.getElementById('confirm-password').value.trim();
  const errorMsg = document.getElementById('error-msg');
  const passMsg = document.getElementById('msg-confirm-password');

  errorMsg.textContent = '';
  passMsg.textContent = '';

  const dominiosValidos = ['@gmail.com', '@hotmail.com', '@unicatolica.edu.co'];
  const emailValido = dominiosValidos.some(dominio => email.endsWith(dominio));

  if (!emailValido) {
    errorMsg.textContent = "El correo debe terminar en @gmail.com, @hotmail.com o @unicatolica.edu.co";
    return;
  }

  if (password.length < 8) {
    passMsg.textContent = "La contraseña debe tener mínimo 8 caracteres.";
    return;
  }

  // Guardar usuario en el array de usuarios
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  usuarios.push({ email, password });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  alert('Formulario válido. Usuario registrado correctamente.');

  window.location.href = "index.html";
});