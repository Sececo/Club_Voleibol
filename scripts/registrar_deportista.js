document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formDeportista');

  // Ocultar opción "TI" en select representante
  const tipoDocumentoRepresentanteSelect = document.getElementById('tipo_documento_representante');
  for (let i = 0; i < tipoDocumentoRepresentanteSelect.options.length; i++) {
    if (tipoDocumentoRepresentanteSelect.options[i].value === 'TI') {
      tipoDocumentoRepresentanteSelect.options[i].style.display = 'none';
    }
  }

  // Mostrar/ocultar sección representante
  const representanteSection = document.getElementById('representante-section');
  const tieneRepresentanteCheckbox = document.getElementById('tiene_representante');
  if (tieneRepresentanteCheckbox && representanteSection) {
    representanteSection.style.display = 'none';
    tieneRepresentanteCheckbox.addEventListener('change', () => {
      representanteSection.style.display = tieneRepresentanteCheckbox.checked ? 'block' : 'none';
    });
  }

  // Funciones para mostrar y eliminar mensajes de error
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

  // Validar un campo con función y mostrar mensaje si no pasa
  function validarCampo(input, validatorFn, mensaje) {
    eliminarError(input);
    if (!validatorFn(input.value.trim())) {
      mostrarError(input, mensaje);
      return false;
    }
    return true;
  }

  // Validación en tiempo real para campos principales
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
        validarCampo(input, validator, msg);
      });
    }
  });

  // Validación en tiempo real para campos de representante (si visible)
  const representanteCampos = [
    {id: 'nombre_representante', validator: val => !val || validarNombre(val), msg: 'Debe iniciar con mayúscula y solo letras.'},
    {id: 'fecha_nacimiento_representante', validator: val => {
      if (!val) return true;
      const fecha = new Date(val);
      if (fecha > new Date()) return false;
      const edad = calcularEdad(val);
      return edad >= 25 && edad <= 80;
    }, msg: 'Edad representante entre 25 y 80 años.'},
    {id: 'sexo_representante', validator: val => !val || ['masculino', 'femenino', 'otro'].includes(val), msg: 'Sexo inválido.'},
    {id: 'telefono_representante', validator: val => !val || /^\+?[\d\s-]{7,15}$/.test(val), msg: 'Teléfono inválido.'},
    {id: 'tipo_documento_representante', validator: val => !val || ['CC', 'CE'].includes(val), msg: 'Tipo documento inválido.'},
    {id: 'documento_representante', validator: val => !val || /^\d+$/.test(val), msg: 'Solo números.'}
  ];

  representanteCampos.forEach(({id, validator, msg}) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        validarCampo(input, validator, msg);
      });
    }
  });

  // Indicador de fuerza de contraseña
  const passwordInput = document.getElementById('password');
  if (passwordInput) {
    const passwordMeter = document.createElement('div');
    passwordMeter.id = 'password-meter';
    passwordMeter.style.height = '6px';
    passwordMeter.style.borderRadius = '4px';
    passwordMeter.style.marginTop = '5px';
    passwordMeter.style.background = '#eee';
    passwordInput.parentNode.appendChild(passwordMeter);

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

      passwordMeter.style.background = color;
      passwordMeter.style.width = width;
      passwordMeter.title = text;
    });
  }

  // Validar al enviar el formulario
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Limpiar errores anteriores
    form.querySelectorAll('.error-message').forEach(e => e.remove());
    form.querySelectorAll('.input-error').forEach(i => i.classList.remove('input-error'));

    let errores = [];

    // Datos principales
    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const usuario = document.getElementById('usuario').value.trim();
    const fechaNacimiento = document.getElementById('fecha_nacimiento').value;
    const sexo = document.getElementById('sexo').value;
    const telefono = document.getElementById('telefono').value.trim();
    const tipoDocumento = document.getElementById('tipo_documento').value;
    const documento = document.getElementById('documento').value.trim();
    const email = document.getElementById('email').value.trim();
    const categoria = document.getElementById('categoria').value;

    // Datos representante
    const nombreRepresentante = document.getElementById('nombre_representante').value.trim();
    const fechaNacimientoRepresentante = document.getElementById('fecha_nacimiento_representante').value;
    const sexoRepresentante = document.getElementById('sexo_representante').value;
    const telefonoRepresentante = document.getElementById('telefono_representante').value.trim();
    const tipoDocumentoRepresentante = document.getElementById('tipo_documento_representante').value;
    const documentoRepresentante = document.getElementById('documento_representante').value.trim();

    // Validar campos principales
    if (!validarNombre(nombres)) errores.push({input: 'nombres', msg: 'Nombres inválidos.'});
    if (!validarNombre(apellidos)) errores.push({input: 'apellidos', msg: 'Apellidos inválidos.'});
    if (!usuario) errores.push({input: 'usuario', msg: 'Usuario obligatorio.'});
    if (!fechaNacimiento) errores.push({input: 'fecha_nacimiento', msg: 'Fecha nacimiento obligatoria.'});
    else {
      const edad = calcularEdad(fechaNacimiento);
      if (edad < 5 || edad > 20) errores.push({input: 'fecha_nacimiento', msg: 'Edad debe estar entre 5 y 20 años.'});
    }
    if (!['masculino', 'femenino', 'otro'].includes(sexo)) errores.push({input: 'sexo', msg: 'Seleccione sexo.'});
    if (!/^\+?[\d\s-]{7,15}$/.test(telefono)) errores.push({input: 'telefono', msg: 'Teléfono inválido.'});
    if (!tipoDocumento) errores.push({input: 'tipo_documento', msg: 'Seleccione tipo documento.'});
    if (!/^\d+$/.test(documento)) errores.push({input: 'documento', msg: 'Documento debe ser numérico.'});
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errores.push({input: 'email', msg: 'Email inválido.'});
    if (!categoria) errores.push({input: 'categoria', msg: 'Seleccione categoría.'});

    // Validar representante solo si visible
    if (tieneRepresentanteCheckbox && tieneRepresentanteCheckbox.checked) {
      if (nombreRepresentante && !validarNombre(nombreRepresentante)) errores.push({input: 'nombre_representante', msg: 'Nombre representante inválido.'});
      if (fechaNacimientoRepresentante) {
        const edadRep = calcularEdad(fechaNacimientoRepresentante);
        if (edadRep < 25 || edadRep > 80) errores.push({input: 'fecha_nacimiento_representante', msg: 'Edad representante entre 25 y 80 años.'});
      }
      if (sexoRepresentante && !['masculino', 'femenino', 'otro'].includes(sexoRepresentante)) errores.push({input: 'sexo_representante', msg: 'Sexo representante inválido.'});
      if (telefonoRepresentante && !/^\+?[\d\s-]{7,15}$/.test(telefonoRepresentante)) errores.push({input: 'telefono_representante', msg: 'Teléfono representante inválido.'});
      if (tipoDocumentoRepresentante && !['CC', 'CE'].includes(tipoDocumentoRepresentante)) errores.push({input: 'tipo_documento_representante', msg: 'Tipo documento representante inválido.'});
      if (documentoRepresentante && !/^\d+$/.test(documentoRepresentante)) errores.push({input: 'documento_representante', msg: 'Documento representante debe ser numérico.'});
    }

    // Validar contraseña (si hay campo)
    if (passwordInput) {
      const pwd = passwordInput.value;
      if (pwd.length < 8) errores.push({input: 'password', msg: 'Contraseña debe tener mínimo 8 caracteres.'});
      if (!/[A-Z]/.test(pwd)) errores.push({input: 'password', msg: 'Debe incluir mayúscula.'});
      if (!/[a-z]/.test(pwd)) errores.push({input: 'password', msg: 'Debe incluir minúscula.'});
      if (!/\d/.test(pwd)) errores.push({input: 'password', msg: 'Debe incluir número.'});
      if (!/[^A-Za-z0-9]/.test(pwd)) errores.push({input: 'password', msg: 'Debe incluir símbolo.'});
    }

    // Mostrar errores o enviar formulario
    if (errores.length > 0) {
      errores.forEach(({input, msg}) => {
        const elemento = document.getElementById(input);
        if (elemento) mostrarError(elemento, msg);
      });
      // Enfocar el primer error
      const primerError = document.querySelector('.input-error');
      if (primerError) primerError.focus();
      return false;
    }

    // Si todo OK, enviar formulario (aquí solo mostramos alert o simular envío)
    alert('Formulario validado correctamente. Enviando...');
    form.submit();
  });
});

