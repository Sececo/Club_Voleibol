document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const modo = urlParams.get("modo") || "consultar";

    const contenedor = document.getElementById("lista-deportistas");
    const mensajeNoJugadores = document.getElementById("mensaje-no-jugadores");
    const filtroContainer = document.getElementById("filtro-categorias");

    function mostrarDeportistas(filtro = "todas") {
        contenedor.innerHTML = "";
        let deportistas = JSON.parse(localStorage.getItem("jugadores")) || [];

        if (deportistas.length === 0) {
            mensajeNoJugadores.style.display = "block";
            filtroContainer.innerHTML = "";
            return;
        } else {
            mensajeNoJugadores.style.display = "none";
            if (!document.getElementById("categoria-select")) {
                const categorias = [...new Set(deportistas.map(j => j.categoria))];
                filtroContainer.innerHTML = `
                    <div class="filter-container">
                        <label for="categoria-select">Filtrar por categoría:</label>
                        <select id="categoria-select">
                            <option value="todas">Todas</option>
                            ${categorias.map(cat => `<option value="${cat}">${cat}</option>`).join("")}
                        </select>
                    </div>
                `;
                document.getElementById("categoria-select").addEventListener("change", (e) => {
                    mostrarDeportistas(e.target.value);
                });
                const currentFilter = urlParams.get("filtroCategoria") || "todas";
                document.getElementById("categoria-select").value = currentFilter;
            }
            const categoriaSelect = document.getElementById("categoria-select");
            if (categoriaSelect && categoriaSelect.value !== filtro) {
                categoriaSelect.value = filtro;
            }
        }

        const filtrados = filtro === "todas"
            ? deportistas
            : deportistas.filter(j => j.categoria === filtro);

        if (filtrados.length === 0) {
            contenedor.innerHTML = "<p>No hay deportistas en esta categoría.</p>";
            return;
        }

        filtrados.forEach((jugador) => {
            const indiceOriginal = deportistas.findIndex(d =>
                d.nombres === jugador.nombres &&
                d.apellidos === jugador.apellidos &&
                d.documento === jugador.documento
            );

            if (indiceOriginal === -1) return;

            const div = document.createElement("div");
            div.classList.add("deportista-item");

            div.innerHTML = `
                <p><strong>Nombre:</strong> ${jugador.nombres} ${jugador.apellidos}</p>
                <p><strong>Categoría:</strong> ${jugador.categoria}</p>
                <p><strong>Estado de Pago:</strong> ${jugador.pago ? "Al día" : "Pendiente"}</p>
                <button class="btn btn-descargar" data-index="${indiceOriginal}">Descargar PDF</button>
                ${modo === "eliminar" ? `<button class="btn btn-eliminar" data-index="${indiceOriginal}">Eliminar</button>` : ""}
            `;

            contenedor.appendChild(div);

            // Crear y agregar botón Editar justo después del botón Descargar PDF
            const btnDescargar = div.querySelector(".btn-descargar");
            if (btnDescargar) {
                const btnEditar = document.createElement("button");
                btnEditar.textContent = "Editar";
                btnEditar.classList.add("btn-editar");
                btnDescargar.insertAdjacentElement("afterend", btnEditar);

                // Evento click para botón Editar que redirige con el índice
                btnEditar.addEventListener("click", () => {
                    window.location.href = `editar.html?index=${indiceOriginal}`;
                });
            }
        });

        // Listeners botones descargar
        document.querySelectorAll(".btn-descargar").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.target.getAttribute("data-index");
                descargarPDF(parseInt(idx));
            });
        });

        // Listeners botones eliminar si modo eliminar
        if (modo === "eliminar") {
            document.querySelectorAll(".btn-eliminar").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const idx = e.target.getAttribute("data-index");
                    if (confirm("¿Estás seguro de que deseas eliminar este deportista?")) {
                        eliminarDeportista(parseInt(idx));
                    }
                });
            });
        }
    }

    function descargarPDF(index) {
        const jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
        const jugador = jugadores[index];
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(14);
        doc.text("Estado de Cuenta - Club de Voleibol", 20, 20);
        doc.text(`Nombre: ${jugador.nombres} ${jugador.apellidos}`, 20, 40);
        doc.text(`Categoría: ${jugador.categoria}`, 20, 50);
        doc.text(`Estado de Pago: ${jugador.pago ? "Al día" : "Pendiente"}`, 20, 60);

        doc.save(`estado_${jugador.nombres.replace(/\s/g, '')}_${jugador.apellidos.replace(/\s/g, '')}.pdf`);
    }

    function eliminarDeportista(index) {
        let deportistas = JSON.parse(localStorage.getItem("jugadores")) || [];
        deportistas.splice(index, 1);
        localStorage.setItem("jugadores", JSON.stringify(deportistas));
        const categoriaSelect = document.getElementById("categoria-select");
        const currentFilter = categoriaSelect ? categoriaSelect.value : "todas";
        mostrarDeportistas(currentFilter);
    }

    mostrarDeportistas();
});
document.addEventListener("DOMContentLoaded", () => {
  // Obtener índice de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const index = parseInt(urlParams.get("index"));

  const jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];

  if (jugadores.length === 0) {
    alert("No hay datos de jugadores guardados.");
    return;
  }

  // Validar índice
  if (isNaN(index) || index < 0 || index >= jugadores.length) {
    alert("Índice de jugador inválido.");
    return;
  }

  // Cargar jugador seleccionado
  const jugador = jugadores[index];

  // Llenar formulario con datos del jugador
  document.getElementById("id_deportista").value = jugador.id || "";
  document.getElementById("nombres").value = jugador.nombres || "";
  document.getElementById("apellidos").value = jugador.apellidos || "";
  document.getElementById("fecha_nacimiento").value = jugador.fechaNacimiento || "";
  document.getElementById("sexo").value = jugador.sexo || "";
  document.getElementById("telefono").value = jugador.telefono || "";
  document.getElementById("tipo_documento").value = jugador.tipoDocumento || "";
  document.getElementById("documento").value = jugador.documento || "";
  document.getElementById("email").value = jugador.email || "";
  document.getElementById("categoria").value = jugador.categoria || "";

  const form = document.querySelector(".formulario");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Obtener valores actualizados del formulario
    const telefono = document.getElementById("telefono").value.trim();
    const tipoDocumento = document.getElementById("tipo_documento").value;
    const email = document.getElementById("email").value.trim();
    const categoria = document.getElementById("categoria").value;

    // Validaciones (igual que antes)
    if (!/^\d{10}$/.test(telefono)) {
      alert("Número de teléfono inválido. Debe tener exactamente 10 dígitos numéricos.");
      return;
    }

    if (!["CC", "TI", "CE"].includes(tipoDocumento)) {
      alert("Por favor selecciona un tipo de documento válido.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Correo inválido. Debe contener '@' y no tener espacios.");
      return;
    }

    if (!["benjamin", "mini", "infantil"].includes(categoria)) {
      alert("Por favor selecciona una categoría válida.");
      return;
    }

    // Actualizar jugador con datos del formulario
    jugador.telefono = telefono;
    jugador.tipoDocumento = tipoDocumento;
    jugador.email = email;
    jugador.categoria = categoria;

    // Guardar jugador actualizado en el arreglo y localStorage
    jugadores[index] = jugador;
    localStorage.setItem("jugadores", JSON.stringify(jugadores));

    alert("Cambios guardados correctamente ✅");
    window.location.href = "gestion_deportistas.html"; // o la página a la que quieras volver
  });
});


