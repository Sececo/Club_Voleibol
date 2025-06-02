document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formCampeonato");
  const idInput = document.getElementById("id_campeonato");

  // Función para obtener el siguiente ID disponible
  function getNextId() {
    const campeonatos = JSON.parse(localStorage.getItem("campeonatos")) || [];
    if (campeonatos.length === 0) return 100;
    return Math.max(...campeonatos.map(c => Number(c.id) || 100)) + 1;
  }

  // Mostrar el siguiente ID disponible
  if (idInput) idInput.value = getNextId();

  // Validadores
  const validadores = {
    nombre_campeonato: {
      fn: val => /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/.test(val) && val.length >= 3,
      msg: 'Debe iniciar con mayúscula, mínimo 3 letras y solo letras/espacios.'
    },
    fecha: {
      fn: val => !!val,
      msg: 'Fecha obligatoria.'
    },
    hora: {
      fn: val => /^\d{2}:\d{2}$/.test(val),
      msg: 'Formato HH:MM.'
    },
    sede: {
      fn: val => /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/.test(val) && val.length >= 3,
      msg: 'Debe iniciar con mayúscula, mínimo 3 letras y solo letras/espacios.'
    },
    categoria: {
      fn: val => !!val,
      msg: 'Seleccione categoría.'
    }
  };

  Object.keys(validadores).forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        eliminarError(input);
        if (!validadores[id].fn(input.value.trim())) {
          mostrarError(input, validadores[id].msg);
        }
      });
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Limpiar errores anteriores
    form.querySelectorAll('.error-message').forEach(e => e.remove());
    form.querySelectorAll('.input-error').forEach(i => i.classList.remove('input-error'));

    let errores = [];

    Object.keys(validadores).forEach(id => {
      const input = document.getElementById(id);
      if (input && !validadores[id].fn(input.value.trim())) {
        errores.push({input, msg: validadores[id].msg});
      }
    });

    // Validaciones adicionales de fecha y hora
    const fecha = document.getElementById("fecha");
    const hora = document.getElementById("hora");
    const hoy = new Date();
    const fechaInicio = new Date(fecha.value);
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);
    const maxFecha = new Date(hoy);
    maxFecha.setMonth(maxFecha.getMonth() + 6);

    if (fecha.value && (fechaInicio < mañana || fechaInicio > maxFecha)) {
      errores.push({input: fecha, msg: "La fecha debe ser entre mañana y 6 meses desde hoy."});
    }

    if (hora.value) {
      const [horaInicio, minutos] = hora.value.split(":").map(Number);
      if (
        isNaN(horaInicio) || isNaN(minutos) ||
        horaInicio < 8 || horaInicio > 20 ||
        minutos < 0 || minutos > 59
      ) {
        errores.push({input: hora, msg: "Hora entre 08:00 y 20:00, minutos entre 00 y 59."});
      }
    }

    // Validar que haya al menos 1 equipo registrado
    const equipos = JSON.parse(localStorage.getItem("equipos")) || [];
    if (equipos.length < 1) {
      errores.push({input: document.getElementById("categoria"), msg: "Debe haber al menos 1 equipo registrado."});
    }

    // Mostrar errores o guardar
    if (errores.length > 0) {
      errores.forEach(({input, msg}) => mostrarError(input, msg));
      const primerError = form.querySelector('.input-error');
      if (primerError) primerError.focus();
      return false;
    }

    // Recuperar campeonatos existentes
    const campeonatos = JSON.parse(localStorage.getItem("campeonatos")) || [];

    // Crear el objeto campeonato
    const campeonato = {
      id: getNextId(),
      nombre: document.getElementById("nombre_campeonato").value.trim(),
      fecha: document.getElementById("fecha").value,
      hora: document.getElementById("hora").value,
      sede: document.getElementById("sede").value.trim(),
      categoria: document.getElementById("categoria").value,
      estado: 'activo',
      equiposAsociados: [] // Para futuras asociaciones
    };

    campeonatos.push(campeonato);
    localStorage.setItem("campeonatos", JSON.stringify(campeonatos));

    alert("¡Campeonato registrado correctamente!");
    form.reset();
    if (idInput) idInput.value = getNextId();
    window.location.href = "gestion_campeonatos.html?modo=consultar";
  });

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
});
