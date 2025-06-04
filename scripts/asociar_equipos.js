document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal-asociar-equipos');
  const cerrarModal = document.getElementById('cerrar-modal-asociar-equipos');
  let campeonatoSeleccionado = null, categoriaSeleccionada = null;

  // Función global para mostrar el modal (llámala desde mostrar_campeonatos.js)
  window.mostrarModalAsociarEquipos = async function(id, categoria) {
    campeonatoSeleccionado = id;
    categoriaSeleccionada = categoria;

    // Traer equipos de la misma categoría
    const resEq = await fetch('http://localhost:3000/equipos');
    const equipos = await resEq.json();

    // Traer asociaciones equipo-deportista
    const resAsoc = await fetch('http://localhost:3000/equipo_deportista');
    const asociaciones = await resAsoc.json();

    // Contar deportistas por equipo
    const cantidadPorEquipo = {};
    asociaciones.forEach(a => {
      cantidadPorEquipo[a.equipo_id] = (cantidadPorEquipo[a.equipo_id] || 0) + 1;
    });

    // Mostrar solo equipos de la categoría y con al menos 6 jugadores
    const listaEq = document.getElementById('lista-equipos-disponibles');
    listaEq.innerHTML = '';
    equipos
      .filter(eq => eq.categoria === categoriaSeleccionada && (cantidadPorEquipo[eq.id] || 0) >= 6)
      .forEach(eq => {
        listaEq.innerHTML += `
          <label>
            <input type="checkbox" name="equipos" value="${eq.id}" />
            ${eq.nombre} (${cantidadPorEquipo[eq.id] || 0} jugadores)
          </label><br>
        `;
      });

    if (!listaEq.innerHTML) {
      listaEq.innerHTML = `<p style="color:red;">No hay equipos con al menos 6 jugadores en esta categoría.</p>`;
    }
    modal.style.display = 'flex';
  };

  cerrarModal.onclick = () => { modal.style.display = 'none'; };
  modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

  // Asociar equipos seleccionados
  document.getElementById('form-asociar-equipos').onsubmit = async function(e) {
    e.preventDefault();
    const seleccionados = Array.from(document.querySelectorAll('input[name="equipos"]:checked')).map(cb => cb.value);
    if (!seleccionados.length) return alert('Selecciona al menos un equipo.');
    const res = await fetch('http://localhost:3000/campeonato_equipo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campeonato_id: campeonatoSeleccionado, equipos: seleccionados })
    });
    if (res.ok) {
      alert('Equipos asociados correctamente.');
      modal.style.display = 'none';
    } else {
      alert('Error al asociar equipos.');
    }
  };

  // Código nuevo para manejar el clic en el botón de asociar
  document.querySelectorAll(".btn-asociar").forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-id");
      const categoria = btn.getAttribute("data-categoria");
      if (window.mostrarModalAsociarEquipos) {
        window.mostrarModalAsociarEquipos(id, categoria);
      }
    };
  });
});
