document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-campeonato");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre-campeonato").value.trim();
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const sede = document.getElementById("sede").value.trim();
    const categoria = document.getElementById("categoria").value;

    if (!nombre || !fecha || !hora || !sede || !categoria) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
      alert("La hora debe estar en formato 24h (HH:MM).");
      return;
    }

    if (!["benjamin", "mini", "infantil"].includes(categoria)) {
      alert("Categoría inválida.");
      return;
    }

    try {
      const campeonato = { nombre, fecha, hora, sede, categoria };
      const res = await fetch("http://localhost:3000/campeonatos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campeonato)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Campeonato creado correctamente");
        form.reset();
      } else {
        alert(data.error || "Error al crear campeonato");
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    }
  });
});
