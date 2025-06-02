document.addEventListener("DOMContentLoaded", function() {
  const deportistas = JSON.parse(localStorage.getItem("deportistas")) || [];
  const equipos = JSON.parse(localStorage.getItem("equipos")) || [];
  const campeonatos = JSON.parse(localStorage.getItem("campeonatos")) || [];
  const emailGuardado = localStorage.getItem("email");
  const usuarioGuardado = localStorage.getItem("usuario");

  // Buscar deportista por email o usuario
  const deportista = deportistas.find(dep =>
    dep.email === emailGuardado || dep.usuario === emailGuardado
  );

  // Mostrar nombre
  if (deportista) {
    document.getElementById("bienvenida").textContent = "Bienvenido, " + (deportista.nombres || deportista.nombre || deportista.usuario);

    // Mostrar equipo
    let equipoNombre = "";
    if (deportista.equipo) {
      equipoNombre = deportista.equipo;
    } else {
      // Buscar equipo por id o nombre si tienes esa relación
      const equipo = equipos.find(eq => eq.integrantes && eq.integrantes.includes(deportista.usuario));
      if (equipo) equipoNombre = equipo.nombre;
    }
    document.getElementById("equipo").textContent = equipoNombre ? "Equipo: " + equipoNombre : "No tienes equipo asignado.";
  }

  // Mostrar campeonatos al hacer clic
  document.getElementById("btn-campeonatos").addEventListener("click", function() {
    const lista = document.getElementById("lista-campeonatos");
    lista.innerHTML = "";
    if (!deportista) {
      lista.textContent = "No se encontró información del deportista.";
      return;
    }
    // Buscar campeonatos donde el equipo del deportista esté inscrito
    let equipoNombre = deportista.equipo;
    if (!equipoNombre && equipos.length > 0) {
      const equipo = equipos.find(eq => eq.integrantes && eq.integrantes.includes(deportista.usuario));
      if (equipo) equipoNombre = equipo.nombre;
    }
    const campeonatosInscrito = campeonatos.filter(camp =>
      camp.equiposAsociados && camp.equiposAsociados.includes(equipoNombre)
    );
    if (campeonatosInscrito.length === 0) {
      lista.textContent = "No estás inscrito en ningún campeonato.";
    } else {
      const ul = document.createElement("ul");
      campeonatosInscrito.forEach(camp => {
        const li = document.createElement("li");
        li.textContent = camp.nombre + " - " + camp.categoria;
        ul.appendChild(li);
      });
      lista.appendChild(ul);
    }
  });

  function actualizarEstadoPago() {
    const estadoPago = document.getElementById("estado-pago");
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

  // Al subir un PDF:
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
    deportista.fechaPago = deportista.fechaPago || new Date().toISOString(); // Solo la primera vez

    // Actualizar en localStorage
    const idx = deportistas.findIndex(dep => dep.email === deportista.email);
    deportistas[idx] = deportista;
    localStorage.setItem("deportistas", JSON.stringify(deportistas));

    input.value = "";
    actualizarEstadoPago();
    mostrarListaPDFs();
    alert("Pago subido correctamente.");
  });

  // Enlace para consultar deportistas
  document.getElementById("consultar-deportistas").addEventListener("click", function() {
    location.href = "consultar_deportista.html?modo=consultar";
  });
});