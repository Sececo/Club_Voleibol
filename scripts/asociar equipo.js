document.addEventListener("DOMContentLoaded", () => {
  const modo = new URLSearchParams(window.location.search).get("modo") || "consultar";
  const section = document.getElementById('asociar-equipos-section');
  if (section) {
    section.style.display = (modo === "consultar") ? "block" : "none";
  }

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
  window.mostrarAsociarEquipos = function(idxCampeonato) {
    const campeonatos = JSON.parse(localStorage.getItem("campeonatos")) || [];
    const equipos = JSON.parse(localStorage.getItem("equipos")) || [];
    const campeonato = campeonatos[idxCampeonato];
    if (!campeonato) return;

    // Solo equipos de la misma categoría y que no estén ya agregados
    const equiposDisponibles = equipos.filter(eq =>
        eq.categoria === campeonato.categoria &&
        !(campeonato.equiposAsociados || []).includes(eq.nombre)
    );
    // Equipos ya asociados
    const equiposAgregados = (campeonato.equiposAsociados || []).map(nombre => {
        return equipos.find(eq => eq.nombre === nombre);
    }).filter(Boolean);

    const section = document.getElementById('asociar-equipos-section');
    if (!section) return;

    section.innerHTML = `
        <h3>Asociar equipos a: ${campeonato.nombre}</h3>
        <form id="form-asociar-equipos" autocomplete="off">
            <div class="form-group">
                <label for="equipos-disponibles">Equipos disponibles (${campeonato.categoria}):</label>
                <select id="equipos-disponibles">
                    <option value="" disabled selected>Seleccione un equipo</option>
                    ${equiposDisponibles.map(eq => `<option value="${eq.nombre}">${eq.nombre}</option>`).join("")}
                </select>
                <button type="button" class="btn-add" id="btn-add-equipo">+</button>
                <button type="button" class="btn-remove" id="btn-remove-equipo">−</button>
            </div>
            <div id="equipos-agregados" class="lista-equipos" style="margin-bottom:1em;">
                ${equiposAgregados.map(eq => `<div>${eq.nombre}</div>`).join("")}
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-primary">Guardar Asociación</button>
                <button type="button" class="btn-secondary" id="cancelar-asociar">Cancelar</button>
            </div>
        </form>
    `;
    section.style.display = "block";

    // Lógica para agregar y quitar equipos
    const selectEquipos = document.getElementById('equipos-disponibles');
    const listaEquipos = document.getElementById('equipos-agregados');
    const btnAdd = document.getElementById('btn-add-equipo');
    const btnRemove = document.getElementById('btn-remove-equipo');
    let equiposAsociados = equiposAgregados.map(eq => eq.nombre);

    function renderizarLista() {
        listaEquipos.innerHTML = '';
        equiposAsociados.forEach(nombre => {
            const div = document.createElement('div');
            div.textContent = nombre;
            listaEquipos.appendChild(div);
        });
    }

    btnAdd.addEventListener('click', () => {
        const seleccionado = selectEquipos.value;
        if (!seleccionado) {
            alert('Seleccione un equipo para agregar.');
            return;
        }
        if (equiposAsociados.includes(seleccionado)) {
            alert('Este equipo ya fue agregado.');
            return;
        }
        equiposAsociados.push(seleccionado);
        renderizarLista();
        // Quitar del select
        selectEquipos.querySelector(`option[value="${seleccionado}"]`).remove();
        selectEquipos.value = '';
    });

    btnRemove.addEventListener('click', () => {
        const seleccionado = selectEquipos.value;
        if (!seleccionado) {
            alert('Seleccione un equipo para quitar.');
            return;
        }
        const idx = equiposAsociados.indexOf(seleccionado);
        if (idx > -1) {
            equiposAsociados.splice(idx, 1);
            // Volver a poner en el select
            const option = document.createElement('option');
            option.value = seleccionado;
            option.textContent = seleccionado;
            selectEquipos.appendChild(option);
            renderizarLista();
        }
    });

    document.getElementById("form-asociar-equipos").onsubmit = function(e) {
        e.preventDefault();
        campeonatos[idxCampeonato].equiposAsociados = equiposAsociados;
        localStorage.setItem("campeonatos", JSON.stringify(campeonatos));
        alert("¡Equipos asociados correctamente!");
        section.style.display = "none";
    };

    document.getElementById("cancelar-asociar").onclick = function() {
        section.style.display = "none";
    };
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
