document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.onsubmit = async function(e) {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value.trim();
      const correo = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirm = document.getElementById('confirm-password').value;
      const errorMsg = document.getElementById('error-msg');
      errorMsg.textContent = "";

      if (!nombre || !correo || !password || !confirm) {
        errorMsg.textContent = "Todos los campos son obligatorios.";
        return;
      }
      if (password !== confirm) {
        errorMsg.textContent = "Las contraseñas no coinciden.";
        return;
      }

      const res = await fetch('http://localhost:3000/administradores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, password })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Administrador registrado correctamente');
        window.location.href = "index.html";
      } else {
        errorMsg.textContent = data.error || "Error al registrar administrador";
      }
    };
  }

  // -------- LOGIN --------
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    function mostrarMensajeRegistro(msg) {
      let errorMsg = document.getElementById('error-msg');
      if (!errorMsg) {
        errorMsg = document.createElement('p');
        errorMsg.id = 'error-msg';
        errorMsg.className = 'error-msg';
        loginForm.appendChild(errorMsg);
      }
      errorMsg.innerHTML = `${msg} <a href="registro.html" style="color:#007bff;text-decoration:underline;">Regístrate aquí</a>`;
      errorMsg.style.display = 'block';
    }

    // Elimina mensaje al escribir
    loginForm.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', () => {
        const errorMsg = document.getElementById('error-msg');
        if (errorMsg) errorMsg.style.display = 'none';
      });
    });

    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      // Validaciones básicas
      if (email === "" || password === "") {
        mostrarMensajeRegistro("Debes ingresar tu correo y contraseña.");
        return;
      }

      // Validar formato de correo
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarMensajeRegistro("Correo electrónico inválido.");
        return;
      }

      // Intentar login como administrador
      try {
        const res = await fetch('http://localhost:3000/login_admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: email, password })
        });
        if (res.ok) {
          // Opcional: puedes guardar info en localStorage/sessionStorage si lo necesitas
          window.location.href = "principal.html";
          return;
        } else {
          const data = await res.json();
          if (data && data.error === 'Credenciales incorrectas') {
            mostrarMensajeRegistro("No tienes una cuenta registrada.");
          } else {
            mostrarMensajeRegistro("Error al iniciar sesión.");
          }
        }
      } catch (err) {
        mostrarMensajeRegistro("Error de conexión con el servidor.");
      }
    });
  }
});