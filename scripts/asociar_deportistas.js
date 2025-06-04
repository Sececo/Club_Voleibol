document.addEventListener('DOMContentLoaded', async () => {
  const modal = document.getElementById('modal-asociar-deportistas');
  const cerrarModal = document.getElementById('cerrar-modal-asociar');
  let equipoSeleccionado = null, categoriaSeleccionada = null, sexoSeleccionado = null;

  // Esta función debe ser llamada desde mostrar_equipos.js al dar click en "Asociar"
  window.mostrarModalAsociarDeportistas = async function(id, categoria, sexo) {
    equipoSeleccionado = id;
    categoriaSeleccionada = categoria;
    sexoSeleccionado = sexo;

    // Traer deportistas de la misma categoría y sexo
    const resDep = await fetch(`http://localhost:3000/deportistas`);
    const deportistas = await resDep.json();
    const listaDep = document.getElementById('lista-deportistas');
    listaDep.innerHTML = '';
    deportistas
      .filter(d => d.categoria === categoriaSeleccionada && d.sexo === sexoSeleccionado)
      .forEach(dep => {
        listaDep.innerHTML += `
          <label>
            <input type="checkbox" name="deportistas" value="${dep.id}" />
            ${dep.nombres} ${dep.apellidos} (${dep.documento})
          </label><br>
        `;
      });
    modal.style.display = 'flex';
  };

  cerrarModal.onclick = () => { modal.style.display = 'none'; };
  modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

  // Asociar deportistas seleccionados
  document.getElementById('form-asociar-deportistas').onsubmit = async function(e) {
    e.preventDefault();
    const seleccionados = Array.from(document.querySelectorAll('input[name="deportistas"]:checked')).map(cb => cb.value);
    if (!seleccionados.length) return alert('Selecciona al menos un deportista.');
    const res = await fetch('http://localhost:3000/equipo_deportista', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ equipo_id: equipoSeleccionado, deportistas: seleccionados })
    });
    if (res.ok) {
      alert('Deportistas asociados correctamente.');
      modal.style.display = 'none';
    } else {
      alert('Error al asociar deportistas.');
    }
  };
});