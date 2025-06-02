document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const nombreInput = document.getElementById('nombre');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirm-password');
  const strengthBar = document.getElementById('password-strength-bar');
  const strengthText = document.getElementById('password-strength-text');
  const msgConfirm = document.getElementById('msg-confirm-password');
  const errorMsg = document.getElementById('error-msg');

  // Validar que cada palabra inicie con mayúscula y solo letras
  function validarNombre(text) {
    return text.split(' ').every(palabra => /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*$/.test(palabra));
  }

  // Medidor de contraseña
  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    let strength = 0;
    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[a-z]/.test(val)) strength++;
    if (/\d/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;

    let color = 'red';
    let width = '20%';
    let text = 'Muy débil';

    switch (strength) {
      case 0:
      case 1:
        color = 'red';
        width = '20%';
        text = 'Muy débil';
        break;
      case 2:
        color = 'orange';
        width = '40%';
        text = 'Débil';
        break;
      case 3:
        color = 'yellow';
        width = '60%';
        text = 'Media';
        break;
      case 4:
        color = 'lightgreen';
        width = '80%';
        text = 'Fuerte';
        break;
      case 5:
        color = 'green';
        width = '100%';
        text = 'Muy fuerte';
        break;
    }
    strengthBar.style.width = width;
    strengthBar.style.background = color;
    strengthText.textContent = text;
  });

  // Validación en tiempo real para nombre
  nombreInput.addEventListener('input', function() {
    if (!validarNombre(this.value.trim())) {
      this.classList.add('input-error');
    } else {
      this.classList.remove('input-error');
    }
  });

  // Validación en tiempo real para confirmación de contraseña
  confirmInput.addEventListener('input', function() {
    if (this.value.length < 8) {
      msgConfirm.textContent = "La contraseña debe tener mínimo 8 caracteres.";
    } else if (this.value !== passwordInput.value) {
      msgConfirm.textContent = "Las contraseñas no coinciden.";
    } else {
      msgConfirm.textContent = "";
    }
  });

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    errorMsg.textContent = '';

    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmInput.value.trim();

    // Validar nombre
    if (!validarNombre(nombre)) {
      errorMsg.textContent = "El nombre debe iniciar con mayúscula y solo contener letras.";
      nombreInput.focus();
      return;
    }

    // Validar correo
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorMsg.textContent = "Correo electrónico inválido.";
      emailInput.focus();
      return;
    }

    // Validar contraseña segura
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength < 4) {
      errorMsg.textContent = "La contraseña debe ser segura (mínimo 8 caracteres, mayúscula, minúscula, número y símbolo).";
      passwordInput.focus();
      return;
    }

    // Validar confirmación de contraseña
    if (password !== confirmPassword) {
      errorMsg.textContent = "Las contraseñas no coinciden.";
      confirmInput.focus();
      return;
    }

    // Guardar administrador (solo nombre, correo y contraseña)
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push({ nombre, email, password });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    window.location.href = "index.html";
  });
});