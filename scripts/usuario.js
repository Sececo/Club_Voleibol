document.addEventListener('DOMContentLoaded', () => {


  // -------- LOGIN --------
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    function mostrarMensajeLogin(msg) {
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

    loginForm.onsubmit= async function (e) {
      e.preventDefault();

      //traer variables ingreadas en el html
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      // Validaciones básicas
      if (email === "" || password === "") {
        mostrarMensajeLogin("Debes ingresar tu correo y contraseña.");
        return;
      }

      // Validar formato de correo
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarMensajeLogin("Correo electrónico inválido.");
        return;
      }

      //verificar conexion con el server
      try {
        const res = await fetch('http://localhost:3000/login_admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password })
        });
        if (res.ok) {
          window.location.href = "principal.html";
          return;
        } else {
          const data = await res.json();
          if (data && data.error === 'Credenciales incorrectas') {
            mostrarMensajeLogin("No tienes una cuenta registrada.");
          } else {
            mostrarMensajeLogin("Error al iniciar sesión.");
          }
        }
      } catch (err) {
        mostrarMensajeLogin("Error de conexión con el servidor.");
      }
    };
  }


//Registro

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {

    //crear funcion de error
    function mostrarMensajeRegistro(msg) {
      let errorMsg = document.getElementById('error-msg');
      if (!errorMsg) {
        errorMsg = document.createElement('p');
        errorMsg.id = 'error-msg';
        errorMsg.className = 'error-msg';
        registerForm.appendChild(errorMsg);
      }
      errorMsg.innerHTML = `${msg}`;
      errorMsg.style.display = 'block';
    }

    // Elimina mensaje de error al escribir
    registerForm.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', () => {
        const errorMsg = document.getElementById('error-msg');
        if (errorMsg) errorMsg.style.display = 'none';
      });
    });

    registerForm.onsubmit = async function(e) {
      e.preventDefault();
      //traer los valores ingresados en el html
      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirm = document.getElementById('confirm-password').value;

      // Validar formato de correo
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarMensajeRegistro("Correo electrónico inválido.");
        return;
      }

      //validar que se hayan ingredasado datos
      if (!nombre || !email || !password || !confirm) {
        mostrarMensajeRegistro("Todos los campos son obligatorios.");
        return;
      }
      //validar que la contraseña sea la misma
      if (password !== confirm) {
        mostrarMensajeRegistro("Las contraseñas no coinciden.");
        return;
      }
      //verificar conexion con el server
      const res = await fetch('http://localhost:3000/administradores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Administrador registrado correctamente');
        window.location.href = "index.html";
      } else {
        console.log(email);
        mostrarMensajeRegistro ("Error del servidor al registrar Administrador");
      }
    };
  }



});