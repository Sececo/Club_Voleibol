document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formEquipo');
  const selectJugadores = document.getElementById('jugadores_disponibles');
  const listaJugadores = document.getElementById('jugadores_agregados');
  const btnAdd = document.querySelector('.btn-add');
  const btnRemove = document.querySelector('.btn-remove');
  const categoriaEquipo = document.getElementById('categoria_equipo');
  const sexoEquipo = document.getElementById('sexo_equipo');

  // Lista de jugadores seleccionados (guardar objeto con nombre y documento)
  const jugadoresAgregados = [];

  // Obtener jugadores registrados desde localStorage (registro_deportista.js)
  function obtenerJugadoresRegistrados(categoria, sexo) {
    const deportistas = JSON.parse(localStorage.getItem('deportistas')) || [];
    return deportistas
      .filter(d =>
        d.nombres && d.apellidos && d.categoria && d.sexo &&
        d.estado !== 'inactivo' &&
        (!categoria || d.categoria === categoria) &&
        (!sexo || d.sexo === sexo)
      )
      .map(d => ({
        nombre: `${d.nombres} ${d.apellidos}`,
        documento: d.documento
      }));
  }

  // Rellenar el select con los jugadores registrados según categoría y sexo
  function cargarJugadoresDisponibles() {
    selectJugadores.innerHTML = '';
    const categoria = categoriaEquipo.value;
    const sexo = sexoEquipo.value;

    // Si no hay categoría o sexo seleccionados, mostrar solo la opción por defecto
    if (!categoria || !sexo) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Seleccione un jugador';
      option.disabled = true;
      option.selected = true;
      selectJugadores.appendChild(option);
      return;
    }

    const jugadoresRegistrados = obtenerJugadoresRegistrados(categoria, sexo)
      .filter(j => !jugadoresAgregados.some(a => a.documento === j.documento));

    if (jugadoresRegistrados.length === 0) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No hay jugadores disponibles';
      option.disabled = true;
      option.selected = true;
      selectJugadores.appendChild(option);
      return;
    }

    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    optionDefault.textContent = 'Seleccione un jugador';
    optionDefault.disabled = true;
    optionDefault.selected = true;
    selectJugadores.appendChild(optionDefault);

    jugadoresRegistrados.forEach(jugador => {
      const option = document.createElement('option');
      option.value = jugador.documento;
      option.textContent = jugador.nombre;
      selectJugadores.appendChild(option);
    });
  }

  // Mostrar los jugadores agregados
  function renderizarLista() {
    listaJugadores.innerHTML = '';
    jugadoresAgregados.forEach(jugador => {
      const div = document.createElement('div');
      div.textContent = jugador.nombre;
      listaJugadores.appendChild(div);
    });
  }

  // Validadores
  const validadores = {
    nombre_equipo: {
      fn: val => /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/.test(val) && val.length >= 3,
      msg: 'Debe iniciar con mayúscula, mínimo 3 letras y solo letras/espacios.'
    },
    entrenador: {
      fn: val => /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/.test(val) && val.length >= 3,
      msg: 'Debe iniciar con mayúscula, mínimo 3 letras y solo letras/espacios.'
    },
    telefono_entrenador: {
      fn: val => /^\+?[\d\s-]{7,15}$/.test(val),
      msg: 'Teléfono no válido.'
    },
    email_entrenador: {
      fn: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      msg: 'Correo no válido.'
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

  // Validaciones estrictas
  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validarTelefono(telefono) {
    return /^\+?[\d\s-]{7,15}$/.test(telefono);
  }
  function validarNombreEquipo(nombre) {
    return /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/.test(nombre) && nombre.length >= 3;
  }
  function validarNombreEntrenador(nombre) {
    return /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/.test(nombre) && nombre.length >= 3;
  }

  function validarFormulario() {
    const nombre = document.getElementById('nombre_equipo').value.trim();
    const categoria = categoriaEquipo.value;
    const sexo = sexoEquipo.value;
    const entrenador = document.getElementById('entrenador').value.trim();
    const telefono = document.getElementById('telefono_entrenador').value.trim();
    const correo = document.getElementById('email_entrenador').value.trim();

    if (!nombre) {
      alert('El nombre del equipo es obligatorio.');
      return false;
    }
    if (!validarNombreEquipo(nombre)) {
      alert('El nombre del equipo debe iniciar con mayúscula, tener al menos 3 letras y solo puede contener letras y espacios.');
      return false;
    }
    if (!categoria) {
      alert('Seleccione la categoría del equipo.');
      return false;
    }
    if (!sexo) {
      alert('Seleccione el sexo del equipo.');
      return false;
    }
    if (!entrenador) {
      alert('El nombre del entrenador es obligatorio.');
      return false;
    }
    if (!validarNombreEntrenador(entrenador)) {
      alert('El nombre del entrenador debe iniciar con mayúscula, tener al menos 3 letras y solo puede contener letras y espacios.');
      return false;
    }
    if (!telefono) {
      alert('El teléfono del entrenador es obligatorio.');
      return false;
    }
    if (!validarTelefono(telefono)) {
      alert('El teléfono del entrenador no es válido.');
      return false;
    }
    if (!correo) {
      alert('El correo del entrenador es obligatorio.');
      return false;
    }
    if (!validarEmail(correo)) {
      alert('El correo del entrenador no es válido.');
      return false;
    }
    if (jugadoresAgregados.length === 0) {
      alert('Debe seleccionar al menos un jugador.');
      return false;
    }
    // No permitir jugadores repetidos
    const setJugadores = new Set(jugadoresAgregados.map(j => j.documento));
    if (setJugadores.size !== jugadoresAgregados.length) {
      alert('No puede agregar jugadores repetidos.');
      return false;
    }
    // No permitir más de 12 jugadores ni menos de 1
    if (jugadoresAgregados.length < 1 || jugadoresAgregados.length > 12) {
      alert('El equipo debe tener entre 1 y 12 jugadores.');
      return false;
    }
    return true;
  }

  // Eventos para actualizar jugadores disponibles
  if (categoriaEquipo) categoriaEquipo.addEventListener('change', cargarJugadoresDisponibles);
  if (sexoEquipo) sexoEquipo.addEventListener('change', cargarJugadoresDisponibles);

  // Agregar jugador
  btnAdd.addEventListener('click', () => {
    const seleccionadoDoc = selectJugadores.value;
    if (!seleccionadoDoc) {
      alert('Seleccione un jugador para agregar.');
      return;
    }
    const categoria = categoriaEquipo.value;
    const sexo = sexoEquipo.value;
    const jugadoresRegistrados = obtenerJugadoresRegistrados(categoria, sexo);
    const jugador = jugadoresRegistrados.find(j => j.documento === seleccionadoDoc);
    if (!jugador) {
      alert('Jugador no válido.');
      return;
    }
    if (jugadoresAgregados.some(j => j.documento === jugador.documento)) {
      alert('Este jugador ya fue agregado.');
      return;
    }
    jugadoresAgregados.push(jugador);
    renderizarLista();
    cargarJugadoresDisponibles();
  });

  // Quitar jugador
  btnRemove.addEventListener('click', () => {
    const seleccionadoDoc = selectJugadores.value;
    const index = jugadoresAgregados.findIndex(j => j.documento === seleccionadoDoc);
    if (index > -1) {
      jugadoresAgregados.splice(index, 1);
      renderizarLista();
      cargarJugadoresDisponibles();
    }
  });

  // Guardar equipo (simulado con localStorage)
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar errores anteriores
    form.querySelectorAll('.error-message').forEach(e => e.remove());
    form.querySelectorAll('.input-error').forEach(i => i.classList.remove('input-error'));

    let errores = [];

    // Validar campos principales
    Object.keys(validadores).forEach(id => {
      const input = document.getElementById(id);
      if (input && !validadores[id].fn(input.value.trim())) {
        errores.push({input, msg: validadores[id].msg});
      }
    });

    if (!categoriaEquipo.value) errores.push({input: categoriaEquipo, msg: 'Seleccione la categoría.'});
    if (!sexoEquipo.value) errores.push({input: sexoEquipo, msg: 'Seleccione el sexo.'});
    if (jugadoresAgregados.length === 0)
      errores.push({input: selectJugadores, msg: 'Debe seleccionar al menos un jugador.'});
    if (jugadoresAgregados.length > 12)
      errores.push({input: selectJugadores, msg: 'Máximo 12 jugadores por equipo.'});

    // Mostrar errores o guardar
    if (errores.length > 0) {
      errores.forEach(({input, msg}) => mostrarError(input, msg));
      const primerError = form.querySelector('.input-error');
      if (primerError) primerError.focus();
      return false;
    }

    const equipo = {
      nombre: document.getElementById('nombre_equipo').value.trim(),
      categoria: categoriaEquipo.value,
      sexo: sexoEquipo.value,
      entrenador: document.getElementById('entrenador').value.trim(),
      telefono: document.getElementById('telefono_entrenador').value.trim(),
      correo: document.getElementById('email_entrenador').value.trim(),
      jugadores: jugadoresAgregados.map(j => j.documento)
    };

    // Simulación de guardado
    const equiposGuardados = JSON.parse(localStorage.getItem('equipos')) || [];
    equiposGuardados.push(equipo);
    localStorage.setItem('equipos', JSON.stringify(equiposGuardados));
    alert('Equipo guardado correctamente.');
    form.reset();
    jugadoresAgregados.length = 0;
    renderizarLista();
    cargarJugadoresDisponibles();
  });

  // Inicializar lista de jugadores disponibles al cargar
  cargarJugadoresDisponibles();
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

localStorage.setItem('deportistas', JSON.stringify(array));
localStorage.setItem('jugadores', JSON.stringify(array));
