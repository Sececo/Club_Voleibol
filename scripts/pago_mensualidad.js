document.addEventListener("DOMContentLoaded", function() {
  const deportistas = JSON.parse(localStorage.getItem("deportistas")) || [];
  const emailGuardado = localStorage.getItem("email");
  const deportista = deportistas.find(dep => dep.email === emailGuardado);

  const estadoPago = document.getElementById("estado-pago");
  const listaPDFs = document.getElementById("lista-pdfs");

  function actualizarEstadoPago() {
    if (!deportista) {
      estadoPago.textContent = "No se encontró información del deportista.";
      return;
    }
    const fechaPago = deportista.fechaPago ? new Date(deportista.fechaPago) : null;
    const hoy = new Date();
    let diasRestantes = 0;
    if (fechaPago) {
      const proximoPago = new Date(fechaPago);
      proximoPago.setMonth(proximoPago.getMonth() + (deportista.pdfPagos ? deportista.pdfPagos.length + 1 : 1));
      diasRestantes = Math.ceil((proximoPago - hoy) / (1000 * 60 * 60 * 24));
      if (diasRestantes < 0) diasRestantes = 0;
      estadoPago.textContent = diasRestantes > 0
        ? `Pago al día. Próximo pago en ${diasRestantes} días.`
        : "¡Debes subir el comprobante de pago de este mes!";
    } else {
      estadoPago.textContent = "No hay registro de pago inicial.";
    }
  }

  function mostrarListaPDFs() {
    listaPDFs.innerHTML = "";
    if (deportista && deportista.pdfPagos && deportista.pdfPagos.length > 0) {
      deportista.pdfPagos.forEach((pago, i) => {
        const li = document.createElement("li");
        li.textContent = `Pago ${i + 1}: ${pago.nombre} (${new Date(pago.fecha).toLocaleDateString()})`;
        listaPDFs.appendChild(li);
      });
    }
  }

  document.getElementById("btn-subir-pago").addEventListener("click", function() {
    const input = document.getElementById("pdf-pago");
    if (!input.files.length) {
      alert("Selecciona un archivo PDF.");
      return;
    }
    const file = input.files[0];
    if (file.type !== "application/pdf") {
      alert("Solo se permite subir archivos PDF.");
      return;
    }
    // Guardar nombre y fecha del PDF en el array de pagos
    const nuevoPago = {
      nombre: file.name,
      fecha: new Date().toISOString()
    };
    deportista.pdfPagos = deportista.pdfPagos || [];
    deportista.pdfPagos.push(nuevoPago);

    // Actualizar en localStorage
    const idx = deportistas.findIndex(dep => dep.email === deportista.email);
    deportistas[idx] = deportista;
    localStorage.setItem("deportistas", JSON.stringify(deportistas));

    input.value = "";
    actualizarEstadoPago();
    mostrarListaPDFs();
    alert("Pago subido correctamente.");
  });

  actualizarEstadoPago();
  mostrarListaPDFs();
});