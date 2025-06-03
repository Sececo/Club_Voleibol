document.addEventListener('DOMContentLoaded', async () => {
  const listaCampeonatos = document.getElementById('lista-campeonatos');
  const modal = document.getElementById('modal-asociar-equipos');
  const cerrarModal = document.getElementById('cerrar-modal-asociar-equipos');
  let campeonatoSeleccionado = null;

  // Mostrar campeonatos
  const res = await fetch('http://localhost:3000/campeonatos');
  const campeonatos = await res.json();
  listaCampeonatos.innerHTML = '';
  campeonatos.forEach(camp => {
    const div = document.createElement('div');
    div.className = 'item-campeonato';
    div.innerHTML = `
      <span>${camp.nombre} (${camp.categoria})</span>
      <button class="btn-pdf" data-id="${camp.id}">Descargar PDF</button>
      <button class="btn-asociar-equipos" data-id="${camp.id}" data-categoria="${camp.categoria}">Asociar Equipos</button>
      <button class="btn-eliminar" data-id="${camp.id}">Eliminar</button>
    `;
    listaCampeonatos.appendChild(div);
  });

  // Descargar PDF
  listaCampeonatos.addEventListener('click', async e => {
    if (e.target.classList.contains('btn-pdf')) {
      const id = e.target.dataset.id;
      const res = await fetch(`http://localhost:3000/campeonatos/${id}`);
      if (!res.ok) return alert("No se pudo obtener la información.");
      const camp = await res.json();
      const contenido = `
        <p><strong>Nombre:</strong> ${camp.nombre}</p>
        <p><strong>Categoría:</strong> ${camp.categoria}</p>
        <p><strong>Fecha:</strong> ${camp.fecha}</p>
        <p><strong>Estado:</strong> ${camp.estado}</p>
      `;
      // Usa tu función descargarPDF (debes tener html2pdf o jsPDF)
      if (window.descargarPDF) {
        window.descargarPDF("Campeonato - " + camp.nombre, contenido, `campeonato_${camp.nombre}.pdf`);
      } else {
        alert("Función de descarga PDF no disponible.");
      }
    }
  });

  // Abrir modal al hacer clic en "Asociar Equipos"
  listaCampeonatos.addEventListener('click', async e => {
    if (e.target.classList.contains('btn-asociar-equipos')) {
      campeonatoSeleccionado = e.target.dataset.id;
      const categoria = e.target.dataset.categoria;

      // Traer equipos de la misma categoría
      const resEq = await fetch(`http://localhost:3000/equipos`);
      const equipos = await resEq.json();
      const listaEq = document.getElementById('lista-equipos-disponibles');
      listaEq.innerHTML = '';
      equipos
        .filter(eq => eq.categoria === categoria)
        .forEach(eq => {
          listaEq.innerHTML += `
            <label>
              <input type="checkbox" name="equipos" value="${eq.id}" />
              ${eq.nombre}
            </label><br>
          `;
        });
      modal.style.display = 'flex';
    }
  });

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

  // Eliminar campeonato
  listaCampeonatos.addEventListener('click', async e => {
    if (e.target.classList.contains('btn-eliminar')) {
      const id = e.target.dataset.id;
      if (!confirm("¿Seguro que quieres eliminar este campeonato?")) return;
      const res = await fetch(`http://localhost:3000/campeonatos/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Campeonato eliminado correctamente.");
        location.reload();
      } else {
        alert("Error al eliminar el campeonato.");
      }
    }
  });
});
