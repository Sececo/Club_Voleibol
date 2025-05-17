const form = document.getElementById("form-campeonato");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre-campeonato").value.trim();
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const sede = document.getElementById("sede").value.trim();
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
});
