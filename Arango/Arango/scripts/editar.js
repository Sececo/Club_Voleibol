document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const modo = urlParams.get("modo") || "consultar";
  const index = parseInt(urlParams.get("index"));
  const jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];

  // Limitar input teléfono a 10 dígitos numéricos
  function limitarTelefono(event) {
    const input = event.target;
    input.value = input.value.replace(/\D/g, ""); // Quitar todo lo que no sea número
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }
  }

  // Agregar listener a teléfonos editables para limitar la longitud
  const telefonoInput = document.getElementById("telefono");
  if (telefonoInput) telefonoInput.addEventListener("input", limitarTelefono);

  const telefonoRepInput = document.getElementById("telefono_representante");
  if (telefonoRepInput) telefonoRepInput.addEventListener("input", limitarTelefono);

  if (!isNaN(index)) {
    if (jugadores.length === 0) {
      alert("No hay datos de jugadores guardados.");
      return;
    }

    if (index < 0 || index >= jugadores.length) {
      alert("Índice de jugador inválido.");
      return;
    }

    const jugador = jugadores[index];

    // Rellenar formulario con datos del jugador
    document.getElementById("nombre").value = jugador.nombres || "";
    document.getElementById("apellido").value = jugador.apellidos || "";
    document.getElementById("usuario").value = jugador.usuario || "";
    document.getElementById("password").value = jugador.password || "";
    document.getElementById("documento").value = jugador.documento || "";
    document.getElementById("fecha_nacimiento").value = jugador.fechaNacimiento || "";
    document.getElementById("sexo").value = jugador.sexo || "";

    document.getElementById("telefono").value = jugador.telefono || "";
    document.getElementById("tipo_documento").value = jugador.tipoDocumento || "";
    document.getElementById("email").value = jugador.email || "";
    document.getElementById("categoria").value = jugador.categoria || "";

    // Rellenar datos del Representante Legal
    const rep = jugador.representante || {};
    document.getElementById("nombre_representante").value = rep.nombre || "";
    document.getElementById("fecha_nacimiento_representante").value = rep.fechaNacimiento || "";
    document.getElementById("sexo_representante").value = rep.sexo || "";
    document.getElementById("telefono_representante").value = rep.telefono || "";
    document.getElementById("tipo_documento_representante").value = rep.tipoDocumento || "";
    document.getElementById("documento_representante").value = rep.documento || "";

    const form = document.getElementById("formDeportista");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const telefono = document.getElementById("telefono").value.trim();
      const tipoDocumento = document.getElementById("tipo_documento").value;
      const email = document.getElementById("email").value.trim();
      const categoria = document.getElementById("categoria").value;
      const telefonoRep = document.getElementById("telefono_representante").value.trim();

      // Validaciones

      // Validar teléfono jugador (exactamente 10 dígitos)
      if (!/^\d{10}$/.test(telefono)) {
        alert("Número de teléfono inválido. Debe tener exactamente 10 dígitos numéricos.");
        return;
      }

      // Validar teléfono representante (vacío o exactamente 10 dígitos)
      if (telefonoRep !== "" && !/^\d{10}$/.test(telefonoRep)) {
        alert("Teléfono del representante inválido. Debe tener exactamente 10 dígitos numéricos o dejarse vacío.");
        return;
      }

      // Validar tipo de documento
      if (!["CC", "TI", "CE"].includes(tipoDocumento)) {
        alert("Por favor selecciona un tipo de documento válido.");
        return;
      }

      // Validar formato correo
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Correo inválido. Debe contener '@' y no tener espacios.");
        return;
      }

      // Validar categoría
      if (!["benjamin", "mini", "infantil"].includes(categoria)) {
        alert("Por favor selecciona una categoría válida.");
        return;
      }

      // Actualizar jugador con datos editables
      jugador.telefono = telefono;
      jugador.tipoDocumento = tipoDocumento;
      jugador.email = email;
      jugador.categoria = categoria;

      // Actualizar representante legal (solo teléfono editable)
      jugador.representante = jugador.representante || {};
      jugador.representante.telefono = telefonoRep;

      // Guardar cambios en localStorage
      jugadores[index] = jugador;
      localStorage.setItem("jugadores", JSON.stringify(jugadores));

      alert("Cambios guardados correctamente ✅");
      window.location.href = "gestion_deportistas.html";
    });

    return; // Detener ejecución después de cargar y configurar todo
  }

  // Si no hay ?index en URL no hace nada porque este script es para edición
});
