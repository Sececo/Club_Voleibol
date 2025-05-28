document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formEquipo');
  const selectJugadores = document.getElementById('jugadores_disponibles');
  const listaJugadores = document.getElementById('jugadores_agregados');
  const btnAdd = document.querySelector('.btn-add');
  const btnRemove = document.querySelector('.btn-remove');

  // Simulación de jugadores registrados (debería venir de backend)
  const jugadoresRegistrados = [
    "Camila López",
    "Mateo Torres",
    "Valentina Ruiz",
    "Santiago Pérez",
    "Mariana Gómez"
  ];

  // Rellenar el select con los jugadores
  jugadoresRegistrados.forEach(nombre => {
    const option = document.createElement('option');
    option.value = nombre;
    option.textContent = nombre;
    selectJugadores.appendChild(option);
  });

  // Lista de jugadores seleccionados
  const jugadoresAgregados = [];

  // Agregar jugador
  btnAdd.addEventListener('click', () => {
    const seleccionado = selectJugadores.value;
    if (!seleccionado || jugadoresAgregados.includes(seleccionado)) return;

    jugadoresAgregados.push(seleccionado);
    renderizarLista();
  });

  // Quitar jugador
  btnRemove.addEventListener('click', () => {
    const seleccionado = selectJugadores.value;
    const index = jugadoresAgregados.indexOf(seleccionado);
    if (index > -1) {
      jugadoresAgregados.splice(index, 1);
      renderizarLista();
    }
  });

  // Mostrar los jugadores agregados
  function renderizarLista() {
    listaJugadores.innerHTML = '';
    jugadoresAgregados.forEach(jugador => {
      const div = document.createElement('div');
      div.textContent = jugador;
      listaJugadores.appendChild(div);
    });
  }

  // Validar formulario
  function validarFormulario() {
    const nombre = document.getElementById('nombre_equipo').value.trim();
    const categoria = document.getElementById('categoria_equipo').value;
    const sexo = document.getElementById('sexo_equipo').value;
    const entrenador = document.getElementById('entrenador').value.trim();
    const telefono = document.getElementById('telefono_entrenador').value.trim();
    const correo = document.getElementById('email_entrenador').value.trim();

    if (!nombre || !categoria || !sexo || !entrenador || !telefono || !correo) {
      alert('Por favor, complete todos los campos obligatorios.');
      return false;
    }

    if (jugadoresAgregados.length === 0) {
      alert('Debe seleccionar al menos un jugador.');
      return false;
    }

    return true;
  }

  // Guardar equipo (simulado con localStorage)
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const equipo = {
      nombre: document.getElementById('nombre_equipo').value.trim(),
      categoria: document.getElementById('categoria_equipo').value,
      sexo: document.getElementById('sexo_equipo').value,
      entrenador: document.getElementById('entrenador').value.trim(),
      telefono: document.getElementById('telefono_entrenador').value.trim(),
      correo: document.getElementById('email_entrenador').value.trim(),
      jugadores: [...jugadoresAgregados]
    };

    // Simulación de guardado
    const equiposGuardados = JSON.parse(localStorage.getItem('equipos')) || [];
    equiposGuardados.push(equipo);
    localStorage.setItem('equipos', JSON.stringify(equiposGuardados));

    alert('Equipo guardado correctamente.');
    form.reset();
    jugadoresAgregados.length = 0;
    renderizarLista();
  });
});
