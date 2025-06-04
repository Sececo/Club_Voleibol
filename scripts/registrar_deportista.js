document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('formDeportista');
  const representanteSection = document.getElementById('representante-section');
  const fechaNacimientoInput = document.getElementById('fecha_nacimiento');
  const tipoDocumentoSelect = document.getElementById('tipo_documento');
  const passwordInput = document.getElementById('password');
  const passwordStrengthBar = document.getElementById('password-strength-bar');
  const passwordStrengthText = document.getElementById('password-strength-text');

  // Limitar fecha de nacimiento a hoy como máximo
  if (fechaNacimientoInput) {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    fechaNacimientoInput.max = `${yyyy}-${mm}-${dd}`;
  }

  // Mostrar/ocultar sección tutor según edad
  function controlarRepresentantePorEdad() {
    const fecha = fechaNacimientoInput.value;
    if (!fecha) {
      if (representanteSection) representanteSection.style.display = 'none';
      if (tipoDocumentoSelect) {
        Array.from(tipoDocumentoSelect.options).forEach(opt => {
          if (opt.value === 'CC') opt.disabled = false;
        });
      }
      return;
    }
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;

    if (edad < 18) {
      if (representanteSection) representanteSection.style.display = 'block';
      if (tipoDocumentoSelect) {
        Array.from(tipoDocumentoSelect.options).forEach(opt => {
          if (opt.value === 'CC') {
            opt.disabled = true;
            if (tipoDocumentoSelect.value === 'CC') tipoDocumentoSelect.value = '';
          }
        });
      }
    } else {
      if (representanteSection) representanteSection.style.display = 'none';
      if (tipoDocumentoSelect) {
        Array.from(tipoDocumentoSelect.options).forEach(opt => {
          if (opt.value === 'CC') opt.disabled = false;
        });
      }
      // Limpia los campos del tutor si no aplica
      ['nombre_tutor','fecha_nacimiento_tutor','tipo_documento_tutor','documento_tutor','telefono_tutor','email_tutor'].forEach(id=>{
        const el = document.getElementById(id);
        if(el) el.value = '';
      });
    }
  }

  if (fechaNacimientoInput) {
    fechaNacimientoInput.addEventListener('input', controlarRepresentantePorEdad);
    fechaNacimientoInput.addEventListener('change', controlarRepresentantePorEdad);
  }

  // Barra de fuerza de contraseña
  if (passwordInput && passwordStrengthBar && passwordStrengthText) {
    passwordInput.addEventListener('input', () => {
      const val = passwordInput.value;
      let strength = 0;
      if (val.length >= 8) strength++;
      if (/[A-Z]/.test(val)) strength++;
      if (/[a-z]/.test(val)) strength++;
      if (/\d/.test(val)) strength++;
      if (/[^A-Za-z0-9]/.test(val)) strength++;

      let color = 'red', width = '20%', text = 'Muy débil';
      switch (strength) {
        case 0: case 1: color = 'red'; width = '20%'; text = 'Muy débil'; break;
        case 2: color = 'orange'; width = '40%'; text = 'Débil'; break;
        case 3: color = 'yellow'; width = '60%'; text = 'Aceptable'; break;
        case 4: color = 'lightgreen'; width = '80%'; text = 'Fuerte'; break;
        case 5: color = 'green'; width = '100%'; text = 'Muy fuerte'; break;
      }
      passwordStrengthBar.style.background = color;
      passwordStrengthBar.style.width = width;
      passwordStrengthText.textContent = text;
    });
  }

  // Validaciones en tiempo real y mensajes de error
  function mostrarError(input, mensaje) {
    eliminarError(input);
    const error = document.createElement('small');
    error.classList.add('error-message');
    error.textContent = mensaje;
    input.parentNode.appendChild(error);
    input.classList.add('input-error');
  }
  function eliminarError(input) {
    const parent = input.parentNode;
    const error = parent.querySelector('.error-message');
    if (error) parent.removeChild(error);
    input.classList.remove('input-error');
  }

  // Validar que cada palabra inicie con mayúscula y contenga solo letras
  function validarNombre(text) {
    return text.split(' ').every(palabra => /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*$/.test(palabra));
  }

  // Calcular edad a partir de fecha
  function calcularEdad(fecha) {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  // Validaciones principales
  const camposValidables = [
    {id: 'nombres', validator: val => val && validarNombre(val), msg: 'Debe iniciar con mayúscula y solo letras.'},
    {id: 'apellidos', validator: val => val && validarNombre(val), msg: 'Debe iniciar con mayúscula y solo letras.'},
    {id: 'usuario', validator: val => val.length > 0, msg: 'Obligatorio.'},
    {id: 'fecha_nacimiento', validator: val => {
      if (!val) return false;
      const fecha = new Date(val);
      if (fecha > new Date()) return false;
      const edad = calcularEdad(val);
      return edad >= 5 && edad <= 20;
    }, msg: 'Edad debe estar entre 5 y 20 años.'},
    {id: 'sexo', validator: val => ['masculino', 'femenino', 'otro'].includes(val), msg: 'Seleccione sexo.'},
    {id: 'telefono', validator: val => /^\+?[\d\s-]{7,15}$/.test(val), msg: 'Teléfono inválido.'},
    {id: 'tipo_documento', validator: val => val.length > 0, msg: 'Seleccione tipo de documento.'},
    {id: 'documento', validator: val => /^\d+$/.test(val), msg: 'Solo números.'},
    {id: 'email', validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), msg: 'Correo inválido.'},
    {id: 'categoria', validator: val => val.length > 0, msg: 'Seleccione categoría.'}
  ];

  camposValidables.forEach(({id, validator, msg}) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        eliminarError(input);
        if (!validator(input.value.trim())) {
          mostrarError(input, msg);
        }
      });
    }
  });

  // Validaciones para tutor
  const tutorCampos = [
    {id: 'nombre_tutor', validator: val => !val || validarNombre(val), msg: 'Debe iniciar con mayúscula y solo letras.'},
    {id: 'fecha_nacimiento_tutor', validator: val => {
      if (!val) return true;
      const fecha = new Date(val);
      if (fecha > new Date()) return false;
      const edad = calcularEdad(val);
      return edad >= 25 && edad <= 80;
    }, msg: 'Edad tutor entre 25 y 80 años.'},
    {id: 'tipo_documento_tutor', validator: val => !val || ['CC', 'CE'].includes(val), msg: 'Tipo documento inválido.'},
    {id: 'documento_tutor', validator: val => !val || /^\d+$/.test(val), msg: 'Solo números.'},
    {id: 'telefono_tutor', validator: val => !val || /^\+?[\d\s-]{7,15}$/.test(val), msg: 'Teléfono inválido.'},
    {id: 'email_tutor', validator: val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), msg: 'Correo inválido.'}
  ];

  tutorCampos.forEach(({id, validator, msg}) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        eliminarError(input);
        if (!validator(input.value.trim())) {
          mostrarError(input, msg);
        }
      });
    }
  });

  // Validar al enviar el formulario
  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Limpiar errores anteriores
    form.querySelectorAll('.error-message').forEach(e => e.remove());
    form.querySelectorAll('.input-error').forEach(i => i.classList.remove('input-error'));

    let errores = [];

    // Validar campos principales
    camposValidables.forEach(({id, validator, msg}) => {
      const input = document.getElementById(id);
      if (input && !validator(input.value.trim())) {
        errores.push({input, msg});
      }
    });

    // Validar contraseña segura
    if (passwordInput) {
      const pwd = passwordInput.value;
      if (pwd.length < 8) errores.push({input: passwordInput, msg: 'Contraseña debe tener mínimo 8 caracteres.'});
      if (!/[A-Z]/.test(pwd)) errores.push({input: passwordInput, msg: 'Debe incluir mayúscula.'});
      if (!/[a-z]/.test(pwd)) errores.push({input: passwordInput, msg: 'Debe incluir minúscula.'});
      if (!/\d/.test(pwd)) errores.push({input: passwordInput, msg: 'Debe incluir número.'});
      if (!/[^A-Za-z0-9]/.test(pwd)) errores.push({input: passwordInput, msg: 'Debe incluir símbolo.'});
    }

    // Validar tutor si es menor de edad
    const fecha = fechaNacimientoInput.value;
    let esMenor = false;
    if (fecha) {
      const hoy = new Date();
      const nacimiento = new Date(fecha);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
      esMenor = edad < 18;
    }
    if (esMenor && representanteSection && representanteSection.style.display !== 'none') {
      tutorCampos.forEach(({id, validator, msg}) => {
        const input = document.getElementById(id);
        if (input && !validator(input.value.trim())) {
          errores.push({input, msg});
        }
      });
    }

    // Mostrar errores o enviar
    if (errores.length > 0) {
      errores.forEach(({input, msg}) => mostrarError(input, msg));
      const primerError = document.querySelector('.input-error');
      if (primerError) primerError.focus();
      return false;
    }

    // Armar objeto para la base de datos
    const nuevoDeportista = {
      nombres: document.getElementById('nombres').value.trim(),
      apellidos: document.getElementById('apellidos').value.trim(),
      usuario: document.getElementById('usuario').value.trim(),
      password: document.getElementById('password').value,
      fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
      sexo: document.getElementById('sexo').value,
      telefono: document.getElementById('telefono').value,
      tipo_documento: document.getElementById('tipo_documento').value,
      documento: document.getElementById('documento').value,
      email: document.getElementById('email').value.trim(),
      categoria: document.getElementById('categoria').value,
      pago: true,
      estado: 'activo',
      nombre_tutor: esMenor ? document.getElementById('nombre_tutor').value.trim() : null,
      fecha_nacimiento_tutor: esMenor ? document.getElementById('fecha_nacimiento_tutor').value : null,
      tipo_documento_tutor: esMenor ? document.getElementById('tipo_documento_tutor').value : null,
      documento_tutor: esMenor ? document.getElementById('documento_tutor').value : null,
      telefono_tutor: esMenor ? document.getElementById('telefono_tutor').value : null,
      email_tutor: esMenor ? document.getElementById('email_tutor').value : null
    };

    try {
      const res = await fetch('http://localhost:3000/deportistas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoDeportista)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Deportista registrado correctamente');
        form.reset();
        if (representanteSection) representanteSection.style.display = 'none';
        if (passwordStrengthBar) {
          passwordStrengthBar.style.width = '0%';
          passwordStrengthText.textContent = '';
        }
      } else {
        alert(data.error || "Error al registrar deportista");
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
      console.error(err);
    }
  });
});