document.addEventListener("DOMContentLoaded", () => {
  // Inicializar ID
  const base = 100;
  let id = localStorage.getItem("ultimoIdCampeonato");
  id = id ? parseInt(id) + 1 : base;
  document.getElementById("id_campeonato").value = id;
  localStorage.setItem("ultimoIdCampeonato", id);

  // Referencias a inputs de texto donde NO se permiten números
  const nombreInput = document.getElementById("nombre-campeonato");
  const sedeInput = document.getElementById("sede");

  const regexSoloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;

  // Función para limpiar caracteres no permitidos al escribir o pegar
  function validarEntrada(event) {
    let valor = event.target.value;
    if (!regexSoloLetras.test(valor)) {
      event.target.value = valor.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    }
  }

  // Bloquear pulsación de teclas no permitidas en tiempo real
  function bloquearNumeros(event) {
    const tecla = event.key;

    const teclasPermitidas = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Tab",
      "Enter",
      "Home",
      "End",
    ];

    if (teclasPermitidas.includes(tecla)) {
      return;
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/.test(tecla)) {
      event.preventDefault();
    }
  }

  nombreInput.addEventListener("keydown", bloquearNumeros);
  sedeInput.addEventListener("keydown", bloquearNumeros);

  nombreInput.addEventListener("input", validarEntrada);
  sedeInput.addEventListener("input", validarEntrada);

  nombreInput.addEventListener("paste", (event) => {
    const textoPegado = (event.clipboardData || window.clipboardData).getData("text");
    if (!regexSoloLetras.test(textoPegado)) {
      event.preventDefault();
    }
  });

  sedeInput.addEventListener("paste", (event) => {
    const textoPegado = (event.clipboardData || window.clipboardData).getData("text");
    if (!regexSoloLetras.test(textoPegado)) {
      event.preventDefault();
    }
  });

  // Manejo de submit para guardar campeonato
  const form = document.getElementById("form-campeonato");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const sede = sedeInput.value.trim();
    const categoria = document.getElementById("categoria").value;

    if (!nombre || !fecha || !hora || !sede || !categoria) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const campeonato = { nombre, fecha, hora, sede, categoria };
    const campeonatos = JSON.parse(localStorage.getItem("campeonatos")) || [];
    campeonatos.push(campeonato);
    localStorage.setItem("campeonatos", JSON.stringify(campeonatos));

    alert("Campeonato creado exitosamente.");
    form.reset();

    // Actualizar ID para el siguiente registro
    let ultimoId = parseInt(localStorage.getItem("ultimoIdCampeonato")) || base;
    ultimoId++;
    localStorage.setItem("ultimoIdCampeonato", ultimoId);
    document.getElementById("id_campeonato").value = ultimoId;
  });
});

