function mostrarDeportistasDisponibles() {
  const categoriaSeleccionada = categoriaEquipo.value;

  jugadoresContainer.innerHTML = "";

  if (!categoriaSeleccionada) {
    jugadoresContainer.innerHTML = "<p>Por favor, seleccione una categoría primero.</p>";
    return;
  }

  const disponibles = deportistas.filter(d => 
    d.categoria === categoriaSeleccionada && d.pago === true
  );

  if (disponibles.length === 0) {
    jugadoresContainer.innerHTML = "<p>No hay deportistas disponibles en esta categoría.</p>";
    return;
  }

  disponibles.forEach(d => {
    const div = document.createElement("div");
    div.classList.add("deportista");
    div.innerHTML = `<p><strong>Nombre:</strong> ${d.nombres} ${d.apellidos}</p>`;
    jugadoresContainer.appendChild(div);
  });

  if (disponibles.length < 9) {
    alert("No hay suficientes deportistas disponibles (se requieren al menos 9).");
  }
}
