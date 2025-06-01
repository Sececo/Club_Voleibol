document.addEventListener("DOMContentLoaded", () => {
  const campeonatos = JSON.parse(localStorage.getItem("campeonatos")) || [];
  const equipos = JSON.parse(localStorage.getItem("equipos")) || [];
  const form = document.getElementById("form-asociar-equipos");
  const listaEquipos = document.getElementById("equipos-disponibles");
  const mensaje = document.getElementById("mensaje-asociar");
  const selectCampeonato = null; // No hay select, se asocia desde el botón en la lista

  // Renderizar campeonatos en la lista principal
  function renderizarCampeonatos() {
    const lista = document.getElementById('lista-items');
    lista.innerHTML = '';
    if (!campeonatos || campeonatos.length === 0) {
      document.getElementById('mensaje-no-items').style.display = '';
      return;
    }
    document.getElementById('mensaje-no-items').style.display = 'none';
    campeonatos.forEach((c, idx) => {
      const div = document.createElement('div');
      div.className = 'campeonato-item';
      div.innerHTML = `
        <strong>${c.nombre}</strong> - ${c.categoria} - ${c.fecha} - ${c.sede}
        <button class="btn-asociar" data-index="${idx}">Asociar equipos</button>
      `;
      lista.appendChild(div);
    });

    // Asignar evento a los botones de asociar
    document.querySelectorAll('.btn-asociar').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = this.getAttribute('data-index');
        mostrarAsociarEquipos(idx);
      });
    });
  }

  // Mostrar sección para asociar equipos
  function mostrarAsociarEquipos(idxCampeonato) {
    const section = document.getElementById('asociar-equipos-section');
    const equiposDisponiblesDiv = document.getElementById('equipos-disponibles');
    const mensaje = document.getElementById('mensaje-asociar');
    mensaje.textContent = '';
    equiposDisponiblesDiv.innerHTML = '';

    const campeonato = campeonatos[idxCampeonato];
    if (!campeonato) return;

    // Filtrar equipos por categoría
    const equiposFiltrados = equipos.filter(e => e.categoria === campeonato.categoria);

    if (equiposFiltrados.length < 1) {
      equiposDisponiblesDiv.innerHTML = `<p>No hay suficientes equipos en la categoría "${campeonato.categoria}". Mínimo 1.</p>`;
      section.style.display = '';
      return;
    }

    equiposFiltrados.forEach(e => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'equipo';
      checkbox.value = e.nombre;
      // Si ya está asociado, marcarlo
      if (campeonato.equiposAsociados && campeonato.equiposAsociados.includes(e.nombre)) {
        checkbox.checked = true;
      }
      label.appendChild(checkbox);
      label.append(` ${e.nombre}`);
      equiposDisponiblesDiv.appendChild(label);
      equiposDisponiblesDiv.appendChild(document.createElement('br'));
    });

    // Guardar el índice del campeonato seleccionado en el form para el submit
    form.setAttribute('data-campeonato-idx', idxCampeonato);
    section.style.display = '';
  }

  // Evento para guardar equipos asociados
  form.addEventListener("submit", e => {
    e.preventDefault();
    const idx = form.getAttribute('data-campeonato-idx');
    if (idx === null) return;

    const seleccionados = Array.from(document.querySelectorAll("#equipos-disponibles input[name='equipo']:checked"))
      .map(cb => cb.value);

    if (seleccionados.length < 1) {
      mensaje.textContent = "Debes seleccionar al menos 1 equipo para asociar.";
      return;
    }

    campeonatos[idx].equiposAsociados = seleccionados;
    localStorage.setItem("campeonatos", JSON.stringify(campeonatos));
    mensaje.textContent = "Equipos asociados correctamente al campeonato.";
    alert('Equipos guardados correctamente.');
    form.reset();
    document.getElementById('asociar-equipos-section').style.display = 'none';
    renderizarCampeonatos();
  });

  // Inicializar lista de campeonatos
  renderizarCampeonatos();
});
