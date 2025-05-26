const jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
const contenedor = document.getElementById("contenedor-cuentas");
const selectorCategoria = document.getElementById("categoria");

function mostrarJugadores(filtro = "todas") {
  contenedor.innerHTML = "";

  const filtrados = filtro === "todas" 
    ? jugadores 
    : jugadores.filter(j => j.categoria === filtro);

  if (filtrados.length === 0) {
    contenedor.innerHTML = "<p>No hay jugadores registrados en esta categoría.</p>";
    return;
  }

  filtrados.forEach((jugador, i) => {
    const div = document.createElement("div");
    div.classList.add("estado-cuenta");
    div.innerHTML = `
      <p><strong>Nombre:</strong> ${jugador.nombres} ${jugador.apellidos}</p>
      <p><strong>Categoría:</strong> ${jugador.categoria}</p>
      <p><strong>Estado de Pago:</strong> ${jugador.pago ? "Al día" : "Pendiente"}</p>
      <button onclick="descargarPDF(${i})" class="btn">Descargar PDF</button>
    `;
    contenedor.appendChild(div);
  });
}

selectorCategoria.addEventListener("change", () => {
  mostrarJugadores(selectorCategoria.value);
});

function descargarPDF(index) {
  const jugador = jugadores[index];
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Estado de Cuenta - Club de Voleibol", 20, 20);
  doc.text(`Nombre: ${jugador.nombres} ${jugador.apellidos}`, 20, 40);
  doc.text(`Categoría: ${jugador.categoria}`, 20, 50);
  doc.text(`Estado de Pago: ${jugador.pago ? "Al día" : "Pendiente"}`, 20, 60);

  doc.save(`estado_${jugador.nombres}_${jugador.apellidos}.pdf`);
}

mostrarJugadores(); // Mostrar al cargar
