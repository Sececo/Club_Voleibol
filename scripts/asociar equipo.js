const campeonatos = JSON.parse(localStorage.getItem("campeonatos")) || [];
const equipos = JSON.parse(localStorage.getItem("equipos")) || [];
const form = document.getElementById("form-asociar");
const selectCampeonato = document.getElementById("campeonato");
const listaEquipos = document.getElementById("lista-equipos");
const mensaje = document.getElementById("mensaje");

// Cargar campeonatos al <select>
campeonatos.forEach((c, i) => {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = `${c.nombre} - ${c.categoria}`;
  selectCampeonato.appendChild(option);
});

selectCampeonato.addEventListener("change", () => {
  const index = selectCampeonato.value;
  listaEquipos.innerHTML = "";
  mensaje.textContent = "";

  if (index === "") return;

  const categoria = campeonatos[index].categoria;
  const equiposFiltrados = equipos.filter(e => e.categoria === categoria);

  if (equiposFiltrados.length < 4) {
    mensaje.textContent = `No hay suficientes equipos en la categoría "${categoria}". Mínimo 4.`;
    return;
  }

  equiposFiltrados.forEach((e, i) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "equipo";
    checkbox.value = e.nombre;
    label.appendChild(checkbox);
    label.append(` ${e.nombre}`);
    listaEquipos.appendChild(label);
    listaEquipos.appendChild(document.createElement("br"));
  });
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const index = selectCampeonato.value;
  if (index === "") return;

  const seleccionados = Array.from(document.querySelectorAll("input[name='equipo']:checked"))
    .map(cb => cb.value);

  if (seleccionados.length < 4) {
    mensaje.textContent = "Debes seleccionar al menos 4 equipos para asociar.";
    return;
  }

  campeonatos[index].equiposAsociados = seleccionados;
  localStorage.setItem("campeonatos", JSON.stringify(campeonatos));
  mensaje.textContent = "Equipos asociados correctamente al campeonato.";
  form.reset();
  listaEquipos.innerHTML = "";
});
